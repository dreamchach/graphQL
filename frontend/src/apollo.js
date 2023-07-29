import {ApolloClient, InMemoryCache} from '@apollo/client'
import gql from 'graphql-tag'

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache : new InMemoryCache()
})

client.query({
    query : gql`
        query AllMovies {
            allMovies {
            Title
            }
        }
    `
}).then(data => console.log(data))

export default client