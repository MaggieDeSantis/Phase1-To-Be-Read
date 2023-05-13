const form = document.getElementById('search-form');
const input = document.getElementById('search-query');
const resultsDiv = document.getElementById('results');
const libraryDiv = document.getElementById('library-books');
const fragment = document.createDocumentFragment();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  search(input.value);
});

function search(query) {
  while (resultsDiv.firstChild) {
    resultsDiv.removeChild(resultsDiv.firstChild);
  }

  fetch(`https://openlibrary.org/search.json?q=${query}`)
    .then(response => response.json())
    .then(data => displayResults(data.docs));
}

function displayResults(books) {
  books = books.filter(book => book.cover_i !== undefined && book.author_name !== undefined);
  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';

    const coverImg = document.createElement('img');
    coverImg.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    coverImg.alt = `Cover for ${book.title}`;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to library';
    addButton.addEventListener('click', () => addToLibrary(book));

    bookDiv.appendChild(coverImg);
    bookDiv.appendChild(addButton);
    fragment.appendChild(bookDiv);
  });

  resultsDiv.appendChild(fragment);
}

function addToLibrary(book) {
  const bookDiv = document.createElement('div');
  bookDiv.className = 'book';

  const coverImg = document.createElement('img');
  coverImg.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  coverImg.alt = `Cover for ${book.title}`;

  const titleH3 = document.createElement('h3');
  titleH3.textContent = book.title;

  const authorP = document.createElement('p');
  authorP.textContent = `Author: ${book.author_name[0]}`;

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-btn';
  removeButton.addEventListener('click', () => bookDiv.remove());

  bookDiv.appendChild(coverImg);
  bookDiv.appendChild(titleH3);
  bookDiv.appendChild(authorP);
  bookDiv.appendChild(removeButton);
  libraryDiv.appendChild(bookDiv);
}
