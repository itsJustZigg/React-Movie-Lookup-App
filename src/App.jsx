import { useState, useEffect, Children } from 'react'
import './App.css'

const apikey = import.meta.env.VITE_API_KEY

/*DO NOT MAKE GITHUB COMMIT UNTIL YOU'VE PLACED THE API KEY IN .ENV FILE AND PUT THAT FILE IN GITIGNORE*/


function HomePage({children}){
  return(
    <>
    {children}
    </>
    
  )
}

// rated, boxOffice, poster, movieTitle, releaseYear, actors, synopsis

function MovieModal({handleModalClose, foundMovie}){
  console.log(foundMovie)
  return (
    <div onClick={handleModalClose} className='overlay'>
      <div className='movie-modal'>
        <img className="modal-poster"  src={foundMovie.Poster}/>
        <div className='modal-content'>
          <h1>{foundMovie.Title}</h1>
          <h2>Year: {foundMovie.Year}</h2>
          <h2>Cast: {foundMovie.Actors}</h2>
          <h2>Rated: {foundMovie.Rated}</h2>
          <h2>Box Office: {foundMovie.BoxOffice}</h2>
          <h2>Synopsis: {foundMovie.Plot}</h2>
        </div>
      </div>
    </div>
  )
}

function MovieGrid({children}){
  return(
    <div className='movie-grid'>
      {children}
    </div>
  )
}

function MovieCard({handleCardClick, movieId, children, movieTitle, releaseYear}){
  
  return (
    <div onClick={() => handleCardClick(movieId)} className='movie-card'>
    {children}  
    <h1>{movieTitle}</h1>
    <h2>{releaseYear}</h2>
    </div>
  )
}

function MoviePoster({poster}){
  return(
    <>
    <img className='movie-poster' src={poster}></img>
    </>
  )
}

function SearchBar({handleSubmit, setSearchTerm}){
 return(
  <>
  <form className='search-form' onSubmit={(e) => handleSubmit(e)}> 
    <input 
    type="text"
    placeholder='Search for a movie...'
    name="searchbar"
    onChange={(e) => setSearchTerm(e.target.value)}></input>
    <button type="submit">Search</button>
  </form>
  </>
 ) 
}

function App() {

  const [searchTerm, setSearchTerm] = useState("")
  const [query, setQuery] = useState("")
  
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [foundMovie, setFoundMovie] = useState()

  const [isOpen, setIsOpen] = useState(false)

  const featuredIds = [
    'tt28650488', //supermario galaxy movie
    'tt21357150', //avengers doomsday
    'tt30825738', //mandalorian & grogu
    'tt29355505', //toy story 5
    'tt12042730', //project hail mary
    'tt17490712', //Mortal kombat II
    'tt0427340', //he-man masters of the universe
    'tt32612507', //lee cronin's the mummy
    'tt22084616', //spiderman brand new day
    'tt37185884', //tom & jerry forbidden compass 
  ]

  //input searchdata into the query params
    useEffect(() => {
      async function fetchMovie() {
        const response = await fetch(`https://www.omdbapi.com/?t=${query}&apikey=${apikey}`)
        const result = await response.json()
          setFeaturedMovies([result])  
      }
      fetchMovie()
    }, [query])


  //to display handful of this year's trending movies
  useEffect(() => {
    async function fetchMovies() {
      const results = await Promise.all(
        featuredIds.map(id => fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apikey}`)
          .then(response => response.json())
        )
      )
      setFeaturedMovies(results) 
    }
    fetchMovies()
  }, [])

  function handleSubmit(e){
    e.preventDefault()
    const data = new FormData(e.target)
    setQuery(data.get("searchbar")) 
  }

  function handleCardClick(movieId){
    setIsOpen(true)
    setFoundMovie(featuredMovies.find(movie => movie.imdbID === movieId))
  }

  function handleModalClose(){
    setIsOpen(false)
  }

  return (
    <>
      <SearchBar setSearchTerm={setSearchTerm} 
      handleSubmit={handleSubmit}/>
      {isOpen && <MovieModal handleModalClose={handleModalClose} foundMovie={foundMovie}></MovieModal>}
      

      <MovieGrid>
      {featuredMovies.map(movie => 
        <MovieCard handleCardClick={handleCardClick} movieId={movie.imdbID} releaseYear={movie.Year} movieTitle={movie.Title}><MoviePoster poster={movie.Poster}></MoviePoster></MovieCard>
      )}
      </MovieGrid>
    </>
  )
}

export default App
