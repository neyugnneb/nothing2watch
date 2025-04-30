const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzdkN2ZlOWFjNDgyMzg3MTdkMjc4YzNkMjAwNmZjMyIsIm5iZiI6MTc0NTkwNjA1Mi4xNTkwMDAyLCJzdWIiOiI2ODEwNjk4NGViMWQ0YjA2ZGUwZmM1ZTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RDcigBIlZUrTT-K3mXjAYLtiFbQ7LqxI8CorXH7d5IU'
    }
  };
  
  fetch('https://api.themoviedb.org/3/authentication', options)
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err));