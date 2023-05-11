const form = document.getElementById('search-form');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = document.getElementById('search-query').value;
  searchBooks(query);
});

function searchBooks(query) {
  const url = `https://openlibrary.org/search.json?q=${query}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const results = data.docs.slice(0, 10).map(book => ({
        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      }));
      saveResults(results);
      displayResults(results);
    })
    .catch(error => console.log(error));
}

function saveResults(results) {
  const data = { results };
  const jsonData = JSON.stringify(data);
  localStorage.setItem('searchResults', jsonData);
}

function getResults() {
  const jsonData = localStorage.getItem('searchResults');
  return JSON.parse(jsonData)?.results || [];
}

function displayResults(results) {
  resultsDiv.innerHTML = '';

  if (results.length === 0) {
    resultsDiv.textContent = 'No results found.';
    return;
  }

  const fragment = document.createDocumentFragment();

  results.forEach(book => {
    const article = document.createElement('article');
    article.classList.add('book');

    const coverImg = document.createElement('img');
    coverImg.src = book.coverUrl;
    coverImg.alt = 'Book cover';

    article.appendChild(coverImg);
    fragment.appendChild(article);
  });

  resultsDiv.appendChild(fragment);
}

window.addEventListener('DOMContentLoaded', () => {
  const results = getResults();
  displayResults(results);
});
