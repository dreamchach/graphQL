# graphQL
> `package.json`파일에서 `"type" : "module"` 을 넣으면 `import`문으로 js파일에 적용할 수 있다.(`index.js`파일에서 참조)

## 01. setup
```bash
Error: Apollo Server requires either an existing schema, modules or typeDefs
```
해결법
```javascript
const typeDefs = gql``
const server = new ApolloServer({typeDefs})
```
`typeDefs` 설정

## 02. Query Type
```bash
GraphQLError: Syntax Error: Unexpected <EOF>.
```

>EOF : end of file의 약자

해결법
```javascript
const typeDefs = gql`
    type Query {
        text : String
    }
`
```
`typeDefs`변수 내부에 객체 타입을 넣어줌


```bash
Error: Query root type must be provided.
```

해결법
```javascript
const typeDefs = gql`
    type Query {
        text : String
    }
`
```
반드시 `typeDefs`변수 root에는 Query타입을 넣어줘야 함

## 3. Scalar and Root Types
만약 id값으로 특정한 데이터를 찾으려 한다면 `arguments`를 설정해줘야 한다.

```javascript
const typeDefs = gql`
    type Tweet {
        id : ID
    }
    type Query {
        tweet(id : ID) : Tweet
    }
`
```
`tweet(id : ID) : Tweet` 여기에서 `()`로 감싸진 부분이 `arguments`이다.

## 4. Mutation Type
```javascript
const typeDefs = gql`
    type Tweet {
        id : ID
    }
    type Query {
        tweet(id : ID) : Tweet
    }
    type Mutation {
        postTweet(text: String, userId : ID) : Tweet
        deleteTweet(id : ID) : Boolean
    }
`
```

`type Mutation`은 `DELETE`, `PUT`, `POST` 메서드를 사용할 때, 반드시 데이터를 넣어야 한다.

## 5. Non Nullable Fields
```javascript
const typeDefs = gql`
    type Tweet {
        id : ID!
    }
    type Query {
        allTweets : [Tweet!]!
        tweet(id : ID!) : Tweet
    }
`
```

`!`는 `Nullable`을 허용하는 않는다는 뜻이다.
만약 `Tweet`의 `id` 데이터 값으로 `ID`나 `null`이 올 수 있는데, `!`를 붙이면 절대 `null`이 오면 안된다.

## 6. Query Resolvers
```javascript
const tweets = [
    {
        id : '1',
        text : 'first one!'
    },
    {
        id : '2',
        text : 'second one!'
    }
]

const typeDefs = gql`
    type Tweet {
        text : String
    }
    type Query {
        allTweets : [Tweet!]!
        tweet(id : ID!) : Tweet
        ping : String!
    }
`

const resolvers = {
    Query : {
        tweet(root, {id}) {
            console.log("I'm called")
            console.log(id)
            return tweets.find((tweet) => tweet.id === id)
        },
        ping() {
            return 'pong'
        },
        allTweets() {
            return tweets
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
```

`resolvers`를 설정해서 query값을 받을 수 있도록 함

## 7. Mutation Resolvers
```javascript
let tweets = [
    {
        id : '1',
        text : 'first one!'
    },
    {
        id : '2',
        text : 'second one!'
    }
]

const resolvers = {
    Query : {...},
    Mutation : {
        postTweet(root, {text, userId}) {
            const newTweet = {
                id : tweets.length + 1,
                text
            }
            tweets.push(newTweet)
            return newTweet
        },
        deleteTweet(root, {id}) {
            const tweet = tweets.find((tweet) => tweet.id === id)
            if(!tweet) return false
            tweets = tweets.filter((tweet) => tweet.id !== id)
            return true
        }
    }
}
```

## 8. Type Resolvers 
```javascript
let users = [
    {
        id : "1",
        firstName : "nico",
        lastName : "les"
    },{
        id : "2",
        firstName : "Elon",
        lastName : 'Mask'
    }
]

const typeDefs = gql`
    type User {
        id : ID!
        firstName : String!
        lastName : String!
        fullName : String!
    }
`

const resolvers = {
    Query : {...},
    Mutation : {...},
    User : {
        fullName({firstName, lastName}) {
            console.log('called fullName')
            // console.log(root)
            return `${firstName} ${lastName}`
        }
    }
}
```

## 9. Relationships
```javascript
let tweets = [
    {
        id : '1',
        userId : "2"
    },
    {
        id : '2',
        userId : "1"
    }
]

let users = [
    {
        id : "1",
        firstName : "nico",
        lastName : "les"
    },{
        id : "2",
        firstName : "Elon",
        lastName : 'Mask'
    }
]

const typeDefs = gql`
    type User {
        id : ID!
        fullName : String!
    }
    type Tweet {
        id : ID!
        author : User!
    }
`

const resolvers = {
    Query : {
        tweet(root, {id}) {
            return tweets.find((tweet) => tweet.id === id)
        },
        allTweets() {
            return tweets
        }
    },
    Tweet : {
        author({userId}) {
            return users.find((user) => user.id === userId)
        }
    }
}
```

## 10. Documentation
```javascript
const typeDefs = gql`
    """
    유저에 관한 설명
    """
    type User {
        id : ID!
    }
    """
    밑에 있는 타입에 관한 설명을 apollo studio의 schema 페이지에서 설명을 확인할 수 있습니다.
    """
    type Tweet {
        id : ID!
        author : User!
    }
    """
    협업을 위해 설명이 필요합니다
    """
    type Query {
        allUsers : [User!]!
        allTweets : [Tweet!]!
    }
`
```

`"""`으로 `schame`에 대한 설명을 넣을 수 있습니다.
넣은 설명은 https://studio.apollographql.com/sandbox/schema/reference 에서 확인할 수 있습니다.

`apollo studio`를 대체할 프로그램으로는 `Altair GraphQL Client`이 있습니다. 
`Altair GraphQL Client`는 오프라인에서도 사용할 수 있는 장점이 있습니다.

## 11. Migrating from REST to GraphQL
```javascript
const typeDefs = gql`
    type Rating {
        Source : String
        Value : String
    }
    type Movie {
        Title : String
        Year : String 
        Rated : String
        Released : String
        Runtime : String
        Genre : String
        Director : String
        Writer : String
        Actors : String 
        Plot : String
        Language : String
        Country : String
        Awards : String
        Poster : String
        Ratings : [Rating]
        Metascore : String
        imdbRating : String
        imdbVotes : String
        imdbID : String
        Type : String 
        DVD : String
        BoxOffice : String
        Production : String
        Website : String 
        Response : String
    }
    type Movies {
        Title : String!
        Year : String!
        imdbID : String!
        Type : String!
        Poster : String!
    }
`
const resolvers = {
    Query : {
        allMovies() {
            return fetch("https://www.omdbapi.com/?apikey=7035c60c&s=hello")
            .then((res) => res.json())
            .then((res) => res.Search)
        },
        movie(root, {id}) {
            return fetch(`http://www.omdbapi.com/?apikey=7035c60c&i=${id}`)
            .then((res) => res.json())
        }
    }
}
```

`fetch API`로 `REST API`에 관한 자료를 받아올 수 있다.

`subscription type`에 관해 알아두는 것이 좋다.
> API가 변경되었을 때 리얼타임으로 업데이트를 받는다.
참고 사이트 : https://www.daleseo.com/graphql-apollo-server-subscriptions/

`Hasura`(https://hasura.io/)는 datebase를 GraphQL로 변경해준다.
