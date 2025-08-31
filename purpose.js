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

  const movies_array = [];
  const remaining = document.getElementById("remaining");
  remaining.innerHTML = 8 - movies_array.length;


//Guest session id
fetch('https://api.themoviedb.org/3/authentication/guest_session/new', getOption)
  .then(res => res.json())
  .then(data => {
    const guest_session = data.guest_session_id;
    console.log(guest_session);
  })
  .catch(err => console.error(err));

//Gets the movie name upon click
//debounced the searchMovie method by 300ms
const debounced = debounce(searchMovie, 300);

preRecommend();

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
    const date = movie.release_date;
    const year = date.substring(0, 4);

    if (i == 0) {
      div.innerHTML = `<h3 id="firstResult">${movie.title} (${year})</h3>`;

    } else if (i == 7) {
      div.innerHTML = `<h3 id="lastResult">${movie.title} (${year})</h3>`;

    } else {
      div.innerHTML = `<h3>${movie.title} (${year})</h3>`;
    }
    
    //When a movie is clicked, fill it out in search bar
    div.addEventListener("click", () => {
      document.getElementById("movieName").value = movie.title + " (" + year + ")";
      resultsDiv.innerHTML = "";
      findMovie(movie);
      
    });
    //Hovering over movie, displays image
    div.addEventListener("mouseover", () => {
      if (!div.querySelector("img")) {
        const img = document.createElement("img");
        if (movie.poster_path) {
          img.src = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
        } else {
          img.src = "";
        }
        img.alt = movie.title;
        div.appendChild(img);
      }
    });

    div.addEventListener("mouseout", () => {
      const img = div.querySelector("img");
      if (img) {
        div.removeChild(img);
      }
      }
    );
    resultsDiv.appendChild(div);
  }}


function findMovie(movie) {
  currentMovie = movie; // Update the current movie
  
  // Remove existing listeners by cloning the button
  const searchButton = document.getElementById("searchButton");
  const newButton = searchButton.cloneNode(true);
  searchButton.parentNode.replaceChild(newButton, searchButton);

  document.getElementById("searchButton").addEventListener("click", ()=>{
    const fullQuery = document.getElementById("movieName").value.trim();
    if (!fullQuery) return;
        if (movies_array.length < 8) {

          let imgSrc = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
          const img = document.createElement("img");
          img.src = imgSrc;
          img.alt = movie.title;

          if (movie.poster_path == null) {
            img.src = "/assets/movies.jpg";
          }

          console.log(movie.id);
  
          const div = document.createElement("div");
          div.className = "movieDisplayed input";
          div.innerHTML = `<h3>-</h3>`;
          div.id = movie.id;
          div.appendChild(img);
  
          div.addEventListener("click", function () {
            this.remove();
            // Remove from array:
            const index = movies_array.indexOf(movie.id);
            if (index > -1) {
              console.log(movies_array);
              remaining.innerHTML++;
            }
  
   
            });
  
          //if movie isn't already included, add it to the list
          if (!movies_array.includes(movie.id)) {
            const list = document.getElementById("list1");
            list.appendChild(div);
            movies_array.push(movie.id);
            console.log(movies_array);
            remaining.innerHTML--;
          }

          document.getElementById("movieName").value = "";
          console.log("working2")

          recommendations(movies_array);

        } else {
          alert("Movie not found.");
        }

      });
  };

  //Function that displays the current recommendations
  function preRecommend() {
    const preRecs = [161, 550, 378064, 414906, 152601, 19913, 641, 533514, 1244492];
    let temp = document.getElementById("prerecs");
    for (let i = 0; i < preRecs.length; i++) {
      fetch(`https://api.themoviedb.org/3/movie/${preRecs[i]}?language=en-US`, getOption)
      .then(res => res.json())
      .then(data => {
        let imgRec ="https://image.tmdb.org/t/p/w200" + data.poster_path;
        const img = document.createElement("img");
        img.src = imgRec;
        img.alt = data.title;

        const div = document.createElement("div");
        div.className = "movieDisplayed";

        div.appendChild(img);

        div.addEventListener("click", () => {
          window.location.replace("https://www.themoviedb.org/movie/" + preRecs[i]);
        });

        temp.appendChild(div);

      })
      .catch(err => console.error(err));
    }

  }
  
  function recommendations(array) {
    console.log("working");
    document.querySelectorAll(".recommendations").forEach(card => card.remove());

    for (let i = 0; i < array.length; i++) {
    //Gets the recommendations for each movie
      fetch(`https://api.themoviedb.org/3/movie/${array[i]}`, getOption)
        .then(res => res.json())
        .then(data => {
            let imgSec = document.createElement("section");
            imgSec.className = `cards recommendations`;
            imgSec.id = `-${array[i]}`;
            
            //Gets the movie's info via id
            fetch(`https://api.themoviedb.org/3/movie/${array[i]}/recommendations?language=en-US&page=1`, getOption)
            .then (res => res.json())
            .then (recData => {
              
            let headers = document.createElement("h1");
            headers.className = "headers";
            headers.textContent = `movies similar to ${data.title}`;

            imgSec.append(headers);

            let secSec = document.createElement("section");
            secSec.className = "display";
            
            for (let j = 0; j < 9; j++) {

              let movieDiv = document.createElement("div");
              let moviePoster = document.createElement("img");

              movieDiv.className = "movieDisplayed";
              moviePoster.src = "https://image.tmdb.org/t/p/w200" + recData.results[j].poster_path;
              moviePoster.alt = recData.results[j].title;

              movieDiv.prepend(moviePoster);

              movieDiv.addEventListener("click", () => {
                window.location.replace("https://www.themoviedb.org/movie/" + recData.results[j].id);
              });

              secSec.prepend(movieDiv);
            }

            document.getElementById(`${array[i]}`).addEventListener("click", () =>{
              console.log("interest");
              console.log(`-${array[i]}`);
              document.getElementById(`-${array[i]}`).remove();
              movies_array.splice(index, 1);
            });

            imgSec.append(secSec);
            
            document.body.append(imgSec);
            })
          })
        }

        }
    

  
