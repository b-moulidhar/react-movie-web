import React from 'react'
import searchIcon from "../assets/search.svg"

const Search = (props) => {
  return (
    <>
    <div className='text-white search'>
        <div >
        <img src={searchIcon} alt="searchIcon" />
        <input type="text"
        placeholder='search through movies'
        onChange={(evt)=>props.setSearchTerm(evt.target.value)}/>
        </div>
    </div>
    </>
  )
}

export default Search