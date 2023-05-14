const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-query');
const resultsSection = document.querySelector('#results');
const librarySection = document.querySelector('#library-books');

// Function to clear results and books
const clearResults = () => {
  resultsSection.textContent = '';
  librarySection.textContent = '';
}

// Function to display book results

const displayResults = (books) => {
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    const bookCover = document.createElement('div');
    bookCover.classList.add('book-cover');

    const bookImage = document.createElement('img');
    bookImage.src = book.volumeInfo.imageLinks.thumbnail;
    bookImage.alt = book.volumeInfo.title;

    bookCover.appendChild(bookImage);
    bookDiv.appendChild(bookCover);
    fragment.appendChild(bookDiv);
  });

  resultsSection.appendChild(fragment);
};

// Function to display book details

const displayBook = (book) => {
  const bookDescription = document.querySelector('#book-description');
  const bookDiv = document.createElement('div');

  const title = document.createElement('h2');
  title.textContent = book.volumeInfo.title;

  const author = document.createElement('p');
  author.textContent = `Author(s): ${book.volumeInfo.authors.join(', ')}`;

  const publisher = document.createElement('p');
  publisher.textContent = `Publisher: ${book.volumeInfo.publisher}`;

  const publishedDate = document.createElement('p');
  publishedDate.textContent = `Published Date: ${book.volumeInfo.publishedDate}`;

  const description = document.createElement('p');
  description.textContent = book.volumeInfo.description;

  const rating = document.createElement('p');
  rating.textContent = `Rating: ${book.volumeInfo.averageRating}/5`;

  const addToLibraryButton = document.createElement('button');
  addToLibraryButton.textContent = 'Add to Library';
  addToLibraryButton.addEventListener('click', () => {
    addBookToLibrary(book);
  });

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(rating);
  bookDiv.appendChild(publisher);
  bookDiv.appendChild(publishedDate);
  bookDiv.appendChild(description);
  
  bookDiv.appendChild(addToLibraryButton);

  bookDescription.textContent = '';
  bookDescription.appendChild(bookDiv);
};


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;

  if (!searchTerm) {
    alert('Please enter a search!');
    return;
  }

  clearResults();

  fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
    .then((response) => response.json())
    .then((data) => {
      const books = data.items;
      displayResults(books);
    })
    .catch((error) => {
      console.error(error);
    });
});

resultsSection.addEventListener('click', (e) => {
  if (e.target.closest('.book')) {
    const book = e.target.closest('.book');
    const bookId = book.querySelector('img').alt;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        const book = data.items[0];
        displayBook(book);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
//Function to add book to library 

const addBookToLibrary = (bookData) => {
  const library = document.querySelector('#library-books');
  const bookCover = document.createElement('div');
  bookCover.classList.add('book-cover');

  const bookImage = document.createElement('img');
  bookImage.src = bookData.volumeInfo.imageLinks.thumbnail;
  bookImage.alt = bookData.volumeInfo.title;
  bookCover.appendChild(bookImage);

  const bookTitle = document.createElement('h3');
  bookTitle.textContent = bookData.volumeInfo.title;
  bookCover.appendChild(bookTitle);

  const readingInfo = document.createElement('div');
  readingInfo.classList.add('reading-info');
  readingInfo.style.display = 'flex';
  readingInfo.style.flexDirection = 'column';
  bookCover.appendChild(readingInfo);

  const startDateInfo = document.createElement('div');
  startDateInfo.classList.add('start-date-info');
  startDateInfo.style.display = 'none';
  readingInfo.appendChild(startDateInfo);

  const startDateButton = document.createElement('button');
  startDateButton.textContent = 'Start Reading';
  startDateButton.classList.add('start-reading-button');
  startDateButton.addEventListener('click', () => {
    const startDate = new Date().toISOString().substring(0, 10);
    bookCover.dataset.startDate = startDate;
    startDateInfo.textContent = `Started: ${startDate}`;
    startDateInfo.style.display = 'block';

    finishDateButton.style.display = 'block';
    startDateButton.style.display = 'none';
  });

  const finishDateInfo = document.createElement('div');
  finishDateInfo.classList.add('finish-date-info');
  finishDateInfo.style.display = 'none';
  readingInfo.appendChild(finishDateInfo);

  const finishDateButton = document.createElement('button');
  finishDateButton.textContent = 'Finish Reading';
  finishDateButton.classList.add('finish-reading-button');
  finishDateButton.addEventListener('click', () => {
    const finishDate = new Date().toISOString().substring(0, 10);
    bookCover.dataset.finishDate = finishDate;
    finishDateInfo.textContent = `Finished: ${finishDate}`;
    finishDateInfo.style.display = 'block';

    finishDateButton.style.display = 'none';
  });

  const removeLink = document.createElement('a');
  removeLink.href = '#';
  removeLink.textContent = 'Remove from Library';
  removeLink.addEventListener('click', () => {
    bookCover.remove();
    removeBookFromLibrary(bookData.id);
  });
  bookCover.appendChild(removeLink);

  library.appendChild(bookCover);
  readingInfo.appendChild(startDateButton);
  readingInfo.appendChild(finishDateButton);
  saveBookToLibrary(bookData);
};

///save to JSON
function saveToJSON() {
  const libraryDiv = document.getElementById('library-div');
  const books = [];
  for (let i = 0; i < libraryDiv.children.length; i++) {
    const book = libraryDiv.children[i];
    books.push({
      id: book.dataset.id,
      title: book.querySelector('.book-title').textContent,
      author: book.querySelector('.book-author').textContent,
      cover_image: book.querySelector('.book-cover').src,
      genre: book.querySelector('.book-genre').textContent,
      page_count: book.querySelector('.book-pages').textContent,
      description: book.querySelector('.book-description').textContent,
      rating: book.querySelector('.book-rating').textContent
    });
  }
  const data = { books };
  const jsonData = JSON.stringify(data, null, 2);

  fetch('/api/books', {
    method: 'PUT',
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('Books saved to db.json file');
    } else {
      console.error('Error saving books to db.json file');
    }
  })
  .catch(error => console.error(error));
}
