const movieDiv = document.getElementById('movie');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

async function fetchMovies(searchTerm = 'narcos') {
  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=f5c24044`);
    const data = await response.json();

    if (data.Response === "True") {
      movieDiv.innerHTML = data.Search.map(movie => `
        <div class="movie-item">
          <h3>${movie.Title} (${movie.Year})</h3>
          <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="Poster van ${movie.Title}" width="150" />
          <button onclick="window.location.href='detail.html?id=${movie.imdbID}'">Bekijk details</button>
        </div>
      `).join('');
    } else {
      movieDiv.innerHTML = `<p>Geen films gevonden voor "${searchTerm}".</p>`;
    }
  } catch (error) {
    movieDiv.innerHTML = `<p>Kon de films niet ophalen.</p>`;
    console.error(error);
  }
}

// Event listener voor zoekknop
searchBtn.addEventListener('click', () => {
  const term = searchInput.value.trim();
  if(term.length > 0){
    fetchMovies(term);
  }
});

// Event listener voor Enter-toets 
searchInput.addEventListener('keypress', e => {
  if(e.key === 'Enter'){
    searchBtn.click();
  }
});

// Start met een standaard zoekterm
fetchMovies();
