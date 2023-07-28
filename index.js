// package.json에 "type" : "module"을 설정했을 때
import { ApolloServer, gql } from "apollo-server";

// package.json에 "type" : "module"을 설정하지 않았을 때
// const {ApolloServer, gql} = require("apollo-server") 

let tweets = [
    {
        id : '1',
        text : 'first one!',
        userId : "2"
    },
    {
        id : '2',
        text : 'second one!',
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
    """
    유저에 관한 설명
    """
    type User {
        id : ID!
        firstName : String!
        lastName : String!
        fullName : String!
    }
    """
    밑에 있는 타입에 관한 설명을 apollo studio의 schema 페이지에서 설명을 확인할 수 있습니다.
    """
    type Tweet {
        id : ID!
        text : String
        author : User!
    }
    """
    협업을 위해 설명이 필요합니다
    """
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
    },
    Tweet : {
        author({userId}) {
            return users.find((user) => user.id === userId)
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`running on ${url}`)
})