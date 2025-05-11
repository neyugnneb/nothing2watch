const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzdkN2ZlOWFjNDgyMzg3MTdkMjc4YzNkMjAwNmZjMyIsIm5iZiI6MTc0NTkwNjA1Mi4xNTkwMDAyLCJzdWIiOiI2ODEwNjk4NGViMWQ0YjA2ZGUwZmM1ZTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RDcigBIlZUrTT-K3mXjAYLtiFbQ7LqxI8CorXH7d5IU"
const BASE_URL = "https://api.themoviedb.org/3/"

//GET
const getOption = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + API_KEY
    }
  };

//Guest session id
fetch('https://api.themoviedb.org/3/authentication/guest_session/new', getOption)
  .then(res => res.json())
  .then(data => {
    const guest_session = data.guest_session_id;
    console.log(guest_session);
  })
  .catch(err => console.error(err));

//Gets the movie name upon click

const debounced = debounce(searchMovie, 300);

document.getElementById("movieName").addEventListener("input", () =>  {
  const query = document.getElementById("movieName").value;
  debounced(query);
});




//FUNCTIONS

//Delay
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

//Searches for results based on movie name
function searchMovie(query) {
  const url = BASE_URL + "search/movie?query=" + encodeURIComponent(query) + "&include_adult=false&language=en-US&page=1";
  fetch(url, getOption)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      displayMovies(data.results);
    })
    .catch (err => console.error(err));

}

//Displays the movies onto the site
function displayMovies(movies) {
  const resultsDiv = document.getElementById("results");
  //Clears old results
  resultsDiv.innerHTML = "";

  //Sorts from most popular to least popular
  movies.sort((a, b) => b.vote_count - a.vote_count);
  console.log(movies);

  //Prints the first 8 results of the returned array(20)
  for (let i = 0; i < 8 && i < movies.length; i++) {
    const movie = movies[i];
    const div = document.createElement("div");

    div.innerHTML = `<h3 id="movie">${movie.title}</h3>`;
    
    div.addEventListener("click", () => {
      document.getElementById("movieName").value = movie.title;
    });
    
    resultsDiv.appendChild(div);
    
  }
    
  }

  
