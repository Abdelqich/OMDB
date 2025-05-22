const movieDiv = document.getElementById('movie');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');
const filterType = document.getElementById('filterType');
const loadingDiv = document.getElementById('loading');
const filterYear = document.getElementById('filterYear');
const filterRating = document.getElementById('filterRating');
const pageTitle = document.getElementById('page-title');

// Voeg klikfunctionaliteit toe aan h1
pageTitle.addEventListener('click', goToHome);

// Sorteerfilms op basis van het geselecteerde criterium
function sortMovies(movies, criteria) {
  switch (criteria) {
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

// Haal films op via de API en pas filters en sortering toe
async function fetchMovies(searchTerm = new Date().getFullYear().toString(), sortCriteria = 'year-desc', filter = '') {
  try {
    loadingDiv.style.display = 'block';
    let url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=f5c24044`;

    const yearValue = filterYear.value.trim();
    if (filter) url += `&type=${filter}`;
    if (yearValue) url += `&y=${yearValue}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      let movies = data.Search;

      // Filter op jaartal indien ingevuld
      if (filterYear.value) {
        movies = movies.filter(movie => movie.Year.slice(0, 4) === filterYear.value);
      }

      // Filter op minimale rating indien ingevuld
      if (filterRating.value) {
        const ratingThreshold = parseFloat(filterRating.value);
        const ratedMovies = await Promise.all(movies.map(async movie => {
          const detailRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=f5c24044`);
          const details = await detailRes.json();
          return { ...movie, imdbRating: parseFloat(details.imdbRating) || 0 };
        }));
        movies = ratedMovies.filter(movie => movie.imdbRating >= ratingThreshold);
      }

      movies = sortMovies(movies, sortCriteria);

      // Toon resultaten op het scherm
      movieDiv.innerHTML = movies.map(movie => `
        <div class="movie-item">
          <h3 style="...">  
            ${movie.Title} (${movie.Year})
          </h3>
          <img 
            class="lazy-img"
            src="/no.png" 
            data-src="${movie.Poster !== 'N/A' ? movie.Poster : '/no.png'}" 
            alt="Poster van ${movie.Title}" 
            width="150"
            onerror="this.onerror=null;this.src='/no.png';"
          />
          <button onclick="window.location.href='details.html?id=${movie.imdbID}'">Bekijk details</button>
          <button class="fav-btn" data-id="${movie.imdbID}">
            ${isFavorite(movie.imdbID) ? '★' : '☆'} Favoriet
          </button>
        </div>
      `).join('');

      // Voeg event listeners toe aan alle "Favoriet"-knoppen
      document.querySelectorAll('.fav-btn').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          addToFavorites(id);
          button.textContent = isFavorite(id) ? '★ Favoriet' : '☆ Favoriet';
        });
      });

      lazyLoadImages();

    } else {
      movieDiv.innerHTML = `<p>Geen films gevonden.</p>`;
    }
  } catch (error) {
    movieDiv.innerHTML = `<p>Kon de films niet ophalen.</p>`;
    console.error(error);
  } finally {
    loadingDiv.style.display = 'none';
  }
}

// Laad afbeeldingen pas als ze in beeld komen (lazy loading)
function lazyLoadImages() {
  const images = document.querySelectorAll('img.lazy-img');
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy-img');
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach(img => observer.observe(img));
}

// Behandel zoekactie vanuit de gebruiker
function handleSearch() {
  const term = searchInput.value.trim();
  if (!term) return alert('Vul een filmtitel in.');
  if (term.length < 2) return alert('De zoekterm moet minstens 2 tekens lang zijn.');
  if (/[^a-zA-Z0-9\s]/.test(term)) return alert('Gebruik alleen letters en cijfers in de zoekopdracht.');

  fetchMovies(term, sortSelect.value, filterType.value);
}

// Event listeners voor zoekknop, enter, filters en sorteren
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', e => e.key === 'Enter' && handleSearch());

sortSelect.addEventListener('change', () => {
  const term = searchInput.value.trim() || new Date().getFullYear().toString();
  fetchMovies(term, sortSelect.value, filterType.value);
});

filterType.addEventListener('change', () => {
  const term = searchInput.value.trim() || new Date().getFullYear().toString();
  fetchMovies(term, sortSelect.value, filterType.value);
});

filterRating.addEventListener('input', () => {
  const term = searchInput.value.trim() || new Date().getFullYear().toString();
  fetchMovies(term, sortSelect.value, filterType.value);
});

// Voeg een film toe aan favorieten in localStorage
function addToFavorites(id) {
  try {
    const existing = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!existing.includes(id)) {
      existing.push(id);
      localStorage.setItem('favorites', JSON.stringify(existing));
      alert('Toegevoegd aan favorieten!');
    } else {
      alert('Deze film staat al in je favorieten.');
    }
  } catch (err) {
    console.error("Kan favoriet niet opslaan:", err);
  }
}

// Controleer of een film al in favorieten zit
function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(id);
}
window.addToFavorites = addToFavorites;
window.isFavorite = isFavorite;

// THEMA TOGGLE
const themeToggle = document.getElementById('themeToggle');
const themes = ['light', 'dark'];
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(savedTheme);

// Wissel tussen licht en donker thema
themeToggle.addEventListener('click', () => {
  const currentTheme = themes.find(t => document.body.classList.contains(t)) || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.replace(currentTheme, newTheme);
  localStorage.setItem('theme', newTheme);
});

// Ga naar homepagina en reset filters en inputvelden
function goToHome() {
  searchInput.value = '';
  filterYear.value = '';
  filterRating.value = '';
  filterType.value = '';
  sortSelect.value = 'year-desc';
  const year = new Date().getFullYear().toString();
  fetchMovies(year, 'year-desc', '', year);
}
window.goToHome = goToHome;

// Initiale data ophalen bij het laden van de pagina
const currentYear = new Date().getFullYear().toString();
fetchMovies(currentYear, 'year-desc', '', currentYear);
