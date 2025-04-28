import { useEffect, useState } from 'react'
import herologo from './assets/hero-img.png'
import './App.css'
import Cards from './components/cards'
import Search from './components/search'
import Spinner from './components/spinner'
import {useDebounce} from "react-use"
import { getTrendingMovie, updateSearchCount } from './appWrite'

function App() {
  const BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_API_CONFIG_KEY;
  const API_OPTIONS = {
    method:'GET',
    headers:{
      accept : 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }
 const [searchTerm,setSearchTerm] = useState('');
 const [errMssg,setErrMssg] = useState(null);
 const [movieList,setMovieList] = useState([]);
 const [isLoading,setIsLoading] = useState(false);
 const [filterData,setFilterData] = useState([]);
 const [trendingMovies, setTrendingMovies] = useState([]);
const [debouceSearchterm,setDebouncedSearchTerm] = useState('');
//  const fetchMovie = async()=>{
//   setIsLoading(true);
//     try {
//       const endpoint = `${BASE_URL}/discover/movie?sort_by=popularity.desc`;
//       const response = await fetch(endpoint,API_OPTIONS);
//       if(!response.ok){
//         throw new Error("fetching of movie failed");
//       }
//       const resdata = await response.json();
//       setMovieList(resdata.results);
//       setIsLoading(false);
//       console.log(resdata);
//     } catch (error) {
//       console.log(error);
//       setErrMssg(`unable to fetch movies ${error}`);
//       setIsLoading(false);
//     }
//  }
 const fetchSearchMovie = async(query="")=>{
  setIsLoading(true);
    try {
      const endpoint = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
      const response = await fetch(endpoint,API_OPTIONS);
      if(!response.ok){
        throw new Error("fetching of movie failed");
      }
      const resdata = await response.json();
      setMovieList(resdata.results);
      if(query && resdata.results.length>0){
        updateSearchCount(query, resdata.results[0]);
      }
      setIsLoading(false);
      console.log(resdata);
    } catch (error) {
      console.log(error);
      setErrMssg(`unable to fetch movies ${error}`);
      setIsLoading(false);
    }
 }
 const trendingMoviesHandler = async() =>{
  try {
    const movies = await getTrendingMovie();
    console.log(movies);
    setTrendingMovies(movies);
  } catch (error) {
    console.log(error);
  }
 }

//  debounce search term to delay the api request --optimization
 useDebounce(()=>{
  setDebouncedSearchTerm(searchTerm);
 },1000,[searchTerm])
//  filtering from the existing data

//  const filterDataHandler = (val)=>{
//   console.log("inside filter");
//     // setSearchTerm(val);
//     const filteredMovies = movieList.filter((value) => value.title.toLowerCase().trim().includes(val.toLowerCase()));
//     setFilterData(filteredMovies);
//  }

//  useEffect(()=>{
//     fetchMovie();
//  },[filterData])

useEffect(()=>{
  fetchSearchMovie(debouceSearchterm);
},[debouceSearchterm]);

useEffect(()=>{
  trendingMoviesHandler();
},[])

  return (
    <>
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <h1>
            <img src={herologo} alt="hero-img" />
            Find <span className='text-gradient'>Movies</span> you'll enjoy
          </h1>
        {/* <Search searchTerm={searchTerm} filterDataHandler={filterDataHandler} /> */}
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {
          trendingMovies.length>0 && 
          <section className='trending'>
            <ul>
              {trendingMovies.map((movie,idx)=>{
                return (<li key={movie.$id}>
                    <p>{idx+1}</p>
                    <img  src={movie.poster_url} />
                </li>)
              })}
            </ul>
          </section>
        }
        <section className="all-movies">
          <h2>All Movies</h2>
          
        </section>
        {(isLoading)? <Spinner/>: errMssg ? <p className='text-red-500'>{errMssg}</p> :
        (filterData.length==0 && <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:gap-1 gap-2'>
          {
            movieList.map(movie => {            
               return <Cards key={movie.id} movie={movie} />
            })
          }
        </section>)
        }
        {filterData.length>0 && 
        <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:gap-1 gap-2'>
          {
            filterData.map(movie => {            
               return <Cards movie={movie} />
            })
          }
        </section>
        }
      </div>
    </main>
     </>
  )
}

export default App
