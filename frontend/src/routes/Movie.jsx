import { gql, useQuery } from '@apollo/client'
import React from 'react'
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
  console.log(data)

  if(loading) {
    return <h1>Fetching movie...</h1>
  }

  return (
    <div>{data.movie.Title}</div>
  )
}

export default Movie