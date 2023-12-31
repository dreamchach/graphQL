import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Link } from 'react-router-dom'

const ALL_MOVIES = gql`
  query Movie {
    allMovies {
      imdbID
      Title
      id
    }
  }
`

const Movies = () => {
  const {data, loading, error} = useQuery(ALL_MOVIES)
  console.log(data)

  if(loading) {
    return <h1>Loading...</h1>
  }
  if(error) {
    return <h1>Could not fetch :(</h1>
  }

  return (
    <div>
      {data.allMovies.map((item) => (
        <div key={item.imdbID}>
          <Link to={`/movies/${item.imdbID}`}>{item.Title}</Link>
        </div>
      ))}
    </div>
  )
}

export default Movies