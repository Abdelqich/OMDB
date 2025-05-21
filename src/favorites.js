const favoritesDiv = document.getElementById('favorites');

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

async function fetchFavoriteDetails(id) {
  const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=f5c24044`);
  const data = await response.json();
  return data.Response === "True" ? data : null;
}

function removeFromFavorites(id) {
  let favs = getFavorites();
  favs = favs.filter(favId => favId !== id);
  localStorage.setItem('favorites', JSON.stringify(favs));
  renderFavorites();
}

async function renderFavorites() {
  const favs = getFavorites();

  if (favs.length === 0) {
    favoritesDiv.innerHTML = "<p>Je hebt nog geen favorieten toegevoegd.</p>";
    return;
  }

  favoritesDiv.innerHTML = "<p>Laden...</p>";

  const promises = favs.map(id => fetchFavoriteDetails(id));
  const movies = await Promise.all(promises);

  favoritesDiv.innerHTML = movies
    .filter(movie => movie !== null)
    .map(movie => `
      <div class="movie-item">
        <h3>${movie.Title} (${movie.Year})</h3>
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/no-poster.png'}" width="150" alt="${movie.Title}" />
        <p>${movie.Genre}</p>
        <a href="detail.html?id=${movie.imdbID}">Bekijk details</a>
        <button onclick="removeFromFavorites('${movie.imdbID}')">🗑 Verwijder</button>
      </div>
    `).join('');
}

renderFavorites();
