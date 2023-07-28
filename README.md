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