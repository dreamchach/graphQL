import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { useParams } from 'react-router-dom'

const GET_MOVIE = gql`
  query Movie($movieId: String) {
    movie(id: $movieId) {
      imdbID
      Title
      id
      isLiked @client
    }
  }
`

const Movie = () => {
  const {id} = useParams()
  const {data, loading, error, client : {cache}} = useQuery(GET_MOVIE, {
    variables : {
      movieId : id,
    }
  })

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

  if(loading) {
    return <h1>Fetching movie...</h1>
  }

  return (
    <div>
      <div>{data?.movie?.Title}</div>
      <button onClick={onclick}>{data?.movie?.isLiked ? 'Unlike' : 'Like'}</button>
    </div>
  )
}

export default Movie