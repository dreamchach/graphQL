import { gql, useApolloClient } from '@apollo/client'
import React, { useEffect, useState } from 'react'

const Movies = () => {
  const client = useApolloClient()
  const [Movies, setMovies] = useState([])
   useEffect(() => {
    client.query({
      query : gql`
      {
        allMovies {
          Title
        }
      }
      `
    }).then((res) => setMovies(res.data.allMovies))
   }, [client])
   
  return (
    <div>
      {Movies.map((item) => (
        <div key={item.Title}>{item.Title}</div>
      ))}
    </div>
  )
}

export default Movies