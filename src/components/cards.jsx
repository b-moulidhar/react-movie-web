import React from 'react'
import star from "../assets/star.svg";
import no_poster from '../assets/no-Poster.svg'

const Cards = ({movie}) => {
  return (
    <>
    <div className="movie-card">
      {movie.adult && <span className='float-right  text-red-600'>18+</span>}
      <img src={movie.poster_path?`https://image.tmdb.org/t/p/w500/${movie.poster_path}`:no_poster} alt="" />
        <span className='text-gradient '>{movie.title}</span>
        <div className="content">
        <div className='rating' >
          <img src={star} alt="star" width={5} height={5}/><p>{movie.vote_average.toFixed(1)}</p>
          <span>·</span>
          <span>{movie.original_language? movie.original_language.toUpperCase(): ""}</span>
          <span>·</span>
          <span>{movie.release_date? movie.release_date.split("-")[0]: ""}</span>
          </div>
        </div>
    </div>
    </>
  )
}

export default Cards