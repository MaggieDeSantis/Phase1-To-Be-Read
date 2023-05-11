const form = document.getElementById('search-form');
const resultsDiv = document.getElementById('results');
const libraryBooksDiv = document.getElementById('library-books');

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
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        isbn: book.isbn?.[0] || '',
        publishYear: book.first_publish_year || '',
      }));
      displayResults(results);
    })
    .catch(error => console.log(error));
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

    const title = document.createElement('h2');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = `by ${book.author}`;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Library';
    addBtn.addEventListener('click', () => {
      addBookToLibrary(book);
      alert(`${book.title} has been added to your library!`);
      displayLibrary();
    });

    article.appendChild(coverImg);
    article.appendChild(title);
    article.appendChild(author);
    article.appendChild(addBtn);
    fragment.appendChild(article);
  });

  resultsDiv.appendChild(fragment);
}

