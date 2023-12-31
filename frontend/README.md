# GraphQL + React
## 1. Installation
```bash
npx create-react-app
npm i @apollo/client
npm i graphql
npm i react-router-dom
```

```bash
npm ERR! Could not resolve dependency : 
peerOptional react@"^16.8.0 || ^17.0.0 from @apollo/client@3.5.10
```
만약 위와 같은 에러가 발생할 경우,
```bash
npm i react-router-dom --legacy-peer-deps
```
로 설치할 것

```bash
One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time.

babel-preset-react-app is part of the create-react-app project, which
is not maintianed anymore. It is thus unlikely that this bug will
ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
your devDependencies to work around this error. This will make this message
go away.
```

> 보통 해당 오류는 CRA 환경을 지원하지 않는 일부 라이브러리를 설치하게 될 경우 발생할 수 있다.

해결법
```bash
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```

## 2. Router
>error
https://stackoverflow.com/questions/43620289/react-router-cannot-read-property-pathname-of-undefined
https://anerim.tistory.com/209

## 3. Setup
>error
https://stackoverflow.com/questions/47367601/react-apollo-gql-typeerror-object-is-not-a-function
https://stackoverflow.com/questions/48863441/apollo-client-how-to-simply-debug-a-400-code-error

>추가된 라이브러리
https://www.npmjs.com/package/graphql-tag

```javascript
// apollo.js

import {ApolloClient, InMemoryCache} from '@apollo/client'

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache : new InMemoryCache()
})

client.query({
    // apollo studio에서 가져오면 좋음(철자 에러 없고, 태그 확인 가능)
    query : gql`
        query AllMovies {
            allMovies {
            Title
            }
        }
    `
}).then(data => console.log(data))

export default client
```
```javascript
// index.js

import client from './apollo';
```
삽입

## 4. ApolloProvider
```javascript
// index.js

import client from './apollo';
import { ApolloProvider } from '@apollo/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    ...
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    ...
);
```

```javascript
// Movies.jsx

import { gql, useApolloClient } from '@apollo/client'

const Movies = () => {
  const client = useApolloClient()
  const [Movies, setMovies] = useState([])
   useEffect(() => {
    client.query({
      query : gql`
      {
        allMovies {
          Title
        }
      }
      `
    }).then((res) => setMovies(res.data.allMovies))
   }, [client])
```

## 5. useQuery
```javascript
// Movies.jsx

import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const ALL_MOVIES = gql`
  {
    allMovies {
      Title
      imdbID
    }
  }
`

const Movies = () => {
  const {data, loading, error} = useQuery(ALL_MOVIES)

  if(loading) {
    return <h1>Loading...</h1>
  }
  if(error) {
    return <h1>Could not fetch :(</h1>
  }

  return (
    <div>
      {data.allMovies.map((item) => (
        <div key={item.imdbID}>
          <Link to={`/movies/${item.imdbID}`}>{item.Title}</Link>
        </div>
      ))}
    </div>
  )
}
```

## 6. useQuery Variables
```javascript
// Movie.jsx

import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

const GET_MOVIE = gql`
  query ($movieId: String) {
    movie(id: $movieId) {
      Title
      imdbID
    }
  }
`

const Movie = () => {
  const {id} = useParams()
  const {data, loading, error} = useQuery(GET_MOVIE, {
    variables : {
      movieId : id
    }
  })

  ...
}
```

## 7. Apollo Dev Tools
1. 크롬 확장 프로그램
- `apollo studio`와 동일한 기능 + 캐시 확인 기능
- https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm


## 8. Local Only Fields
```javascript
const GET_MOVIE = gql`
  query ($movieId: String) {
    movie(id: $movieId) {
      isLiked @client
    }
  }
`
```

`@client`로 로컬에서 만든 필드인 것을 명시할 수 있다. 
명시해두지 않으면 나중에 에러가 발생한다.

## 9. writeFragment
```javascript
  const {data, loading, error, client : {cache}} = useQuery(GET_MOVIE, ...)

  const onclick = () => {
    cache.writeFragment({
      id : `Movie:${id}`,
      fragment : gql`
        fragment IWANT on Movie {
          isLiked
        }
      `,
      data : {
        isLiked : !data?.movie?.isLiked
      }
    })
  }
```

cache는 `__typename + id`으로 구성된 객체들이 있다. 이 부분이 수정되어야 하므로 backend를 수정했다.