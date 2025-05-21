const detailDiv = document.getElementById('movie-detail');
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

console.log("Gevonden movieId:", movieId);

async function fetchMovieDetail(id) {
  detailDiv.innerHTML = `<p>Laden...</p>`;
  try {
    const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=f5c24044`);
    const data = await response.json();

    if (data.Response === "True") {
      detailDiv.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <img src="${data.Poster}" alt="${data.Title}" width="200" />
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
        <a href="index.html">← Terug naar zoeken</a>
      `;
    } else {
      detailDiv.innerHTML = `<p>Film niet gevonden.</p>`;
    }
  } catch (error) {
    detailDiv.innerHTML = `<p>Fout bij het laden van de film.</p>`;
    console.error(error);
  }
}

if (movieId) {
  fetchMovieDetail(movieId);
} else {
  detailDiv.innerHTML = `<p>Geen film ID gevonden in de URL.</p>`;
}
