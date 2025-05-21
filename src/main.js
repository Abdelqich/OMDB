const movieDiv = document.getElementById('movie');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const filterType = document.getElementById('filterType');
const loadingDiv = document.getElementById('loading');
const filterYear = document.getElementById('filterYear');
const filterRating = document.getElementById('filterRating');



function sortMovies(movies, criteria) {
  switch(criteria) {
    case 'title-asc':
      return movies.sort((a, b) => a.Title.localeCompare(b.Title));
    case 'title-desc':
      return movies.sort((a, b) => b.Title.localeCompare(a.Title));
    case 'year-asc':
      return movies.sort((a, b) => a.Year.localeCompare(b.Year));
    case 'year-desc':
      return movies.sort((a, b) => b.Year.localeCompare(a.Year));
    default:
      return movies;
  }
}

async function fetchMovies(searchTerm = 'spider-man', sortCriteria = 'title-asc',filter = '') {
  try {
    loadingDiv.style.display = 'block'; 
    let url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=f5c24044`;
    if (filter) {
      url += `&type=${filter}`;
    }
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      let movies = data.Search;
      if (filterYear.value) {
      movies = movies.filter(movie => {
      // Soms is year een string zoals "2010–2015", pak eerste 4 cijfers
      const year = movie.Year.slice(0,4);
      return year === filterYear.value;
    });
}
      movies = sortMovies(movies, sortCriteria);

      movieDiv.innerHTML = movies.map(movie => `
        <div class="movie-item">
          <h3>${movie.Title} (${movie.Year})</h3>
          <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}" alt="Poster van ${movie.Title}" width="150" />
          <button onclick="window.location.href='details.html?id=${movie.imdbID}'">Bekijk details</button>
          <button class="fav-btn" data-id="${movie.imdbID}">
            ${isFavorite(movie.imdbID) ? '★' : '☆'} Favoriet
          </button>



        </div>
      `).join('');
      // Na movieDiv.innerHTML = ...;
      document.querySelectorAll('.fav-btn').forEach(button => {
      button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      addToFavorites(id);
      // Knoptekst updaten:
      button.textContent = isFavorite(id) ? '★ Favoriet' : '☆ Favoriet';
  });
});

    } else {
      movieDiv.innerHTML = `<p>Geen films gevonden voor "${searchTerm}".</p>`;
    }
  } catch (error) {
    movieDiv.innerHTML = `<p>Kon de films niet ophalen.</p>`;
    console.error(error);
  }
  finally {
    loadingDiv.style.display = 'none'; // Verberg loading
  }
}

function handleSearch() {
  const term = searchInput.value.trim();

  if (!term) {
    alert('Vul een filmtitel in.');
    return;
  }

  if (term.length < 2) {
    alert('De zoekterm moet minstens 2 tekens lang zijn.');
    return;
  }

  const invalidChars = /[^a-zA-Z0-9\s]/;
  if (invalidChars.test(term)) {
    alert('Gebruik alleen letters en cijfers in de zoekopdracht.');
    return;
  }

  fetchMovies(term, sortSelect.value,filterType.value);
}


searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleSearch();
});

sortSelect.addEventListener('change', () => {
  const term = searchInput.value.trim() || 'spider-man';
  fetchMovies(term, sortSelect.value,filterType.value);
});
function addToFavorites(id) {
  const existing = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!existing.includes(id)) {
    existing.push(id);
    localStorage.setItem('favorites', JSON.stringify(existing));
    alert('Toegevoegd aan favorieten!');
  } else {
    alert('Deze film staat al in je favorieten.');
  }
}

function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(id);
}
window.addToFavorites = addToFavorites;
window.isFavorite = isFavorite;

const themeToggle = document.getElementById('themeToggle');

// Zet opgeslagen thema bij opstart
document.body.classList.add(localStorage.getItem('theme') || 'light');

// Toggle logica
themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);
  localStorage.setItem('theme', newTheme);
});
filterType.addEventListener('change', () => {
  const term = searchInput.value.trim() || 'spider-man';
  fetchMovies(term, sortSelect.value, filterType.value);
});


// Initial load
fetchMovies();
