// package.json에 "type" : "module"을 설정했을 때
import { ApolloServer, gql } from "apollo-server";

// package.json에 "type" : "module"을 설정하지 않았을 때
// const {ApolloServer, gql} = require("apollo-server") 

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
    type Tweet {
        id : ID!
        text : String
        author : User!
    }
    type Query {
        allUsers : [User!]!
        allTweets : [Tweet!]!
        tweet(id : ID!) : Tweet
        ping : String!
    }
    type Mutation {
        postTweet(text: String!, userId : ID!) : Tweet!
        deleteTweet(id : ID!) : Boolean!
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
        },
        allUsers() {
            console.log('called user')
            return users
        }
    },
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
    },
    User : {
        fullName({firstName, lastName}) {
            console.log('called fullName')
            // console.log(root)
            return `${firstName} ${lastName}`
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`running on ${url}`)
})