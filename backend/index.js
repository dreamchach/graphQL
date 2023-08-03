// package.json에 "type" : "module"을 설정했을 때
import { ApolloServer, gql } from "apollo-server";

// package.json에 "type" : "module"을 설정하지 않았을 때
// const {ApolloServer, gql} = require("apollo-server") 

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
        id : String
    }
    type Query {
        movie(id : String) : Movie
        allMovies : [Movie]
    }
    type Mutation {
        movie(id : String) : Movie
    }
`

const resolvers = {
    Query : {
        allMovies() {
            return fetch("https://www.omdbapi.com/?apikey=7035c60c&s=hello")
            .then((res) => res.json())
            .then((res) => {
                const items = res.Search.map((item) => {
                    item = {...item, id : item.imdbID}
                    return item
                })
                return items
            })
        },
        movie(root, {id}) {
            return fetch(`http://www.omdbapi.com/?apikey=7035c60c&i=${id}`)
            .then((res) => res.json())
            .then((res) => {
                const item = {...res, id : res.imdbID}
                return item
            })
        }
    },
    Mutation : {
        movie(root, {id}) {
            return fetch(`http://www.omdbapi.com/?apikey=7035c60c&i=${id}`)
            .then((res) => res.json())
            .then((res) => {
                const item = {...res, id : res.imdbID}
                return item
            })
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`running on ${url}`)
})