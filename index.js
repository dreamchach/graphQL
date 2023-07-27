// package.json에 "type" : "module"을 설정했을 때
import { ApolloServer, gql } from "apollo-server";

// package.json에 "type" : "module"을 설정하지 않았을 때
// const {ApolloServer, gql} = require("apollo-server") 

const typeDefs = gql`
    type Query {
        text : String
    }
`

const server = new ApolloServer({typeDefs})

server.listen().then(({url}) => {
    console.log(`running on ${url}`)
})