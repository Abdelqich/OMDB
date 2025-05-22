const detailDiv = document.getElementById('movie-detail');
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

// Thema toepassen vanuit localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(savedTheme);

async function fetchMovieDetail(id) {
  detailDiv.innerHTML = `<p>Laden...</p>`;
  try {
    const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=f5c24044`);
    const data = await response.json();

    if (data.Response === "True") {
      // Check voor poster fallback
      const posterUrl = (data.Poster && data.Poster !== 'N/A') ? data.Poster : '/no.png';

      detailDiv.innerHTML = `
        <h2>${data.Title} (${data.Year})</h2>
        <img 
          src="${posterUrl}" 
          alt="Poster van ${data.Title}" 
          width="200"
          onerror="this.onerror=null;this.src='/no.png';"
        />
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
