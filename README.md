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

