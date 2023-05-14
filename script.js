const form = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-query');
const resultsSection = document.querySelector('#results');
const librarySection = document.querySelector('#library-books');

// Function to clear results and books
const clearResults = () => {
  resultsSection.textContent = '';
}

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

  //create option to add to library

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
  
  
  const hideDescLink = document.createElement('a');
  hideDescLink.textContent = 'Hide';
  hideDescLink.href = '#';
  hideDescLink.addEventListener('click', (e) => {
    e.preventDefault();
    bookDescription.textContent = ' ';
  });
 
  bookDiv.appendChild(addToLibraryButton);
  bookDiv.appendChild(hideDescLink);

  bookDescription.textContent = '';
  bookDescription.appendChild(bookDiv);
};

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

// Check if the book is already in the library
  const bookImageAlt = bookData.volumeInfo.title;
  const existingBookImages = library.querySelectorAll('.book-cover img');
  for (let i = 0; i < existingBookImages.length; i++) {
    if (existingBookImages[i].alt === bookImageAlt) {
      alert('This book is already in your library!');
      return;
    }
  }

  const bookCover = document.createElement('div');
  bookCover.classList.add('book-cover');

  const bookImage = document.createElement('img');
  bookImage.src = bookData.volumeInfo.imageLinks.thumbnail;
  bookImage.alt = bookImageAlt;
  bookCover.appendChild(bookImage);

  const bookTitle = document.createElement('h3');
  bookTitle.textContent = bookData.volumeInfo.title;
  bookCover.appendChild(bookTitle);

  const readingInfo = document.createElement('div');
  readingInfo.classList.add('reading-info');
  readingInfo.style.display = 'flex';
  readingInfo.style.flexDirection = 'column';
  bookCover.appendChild(readingInfo);

  // create start reading button

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

  // create finish reading button

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
// create remove book button

const removeButton = document.createElement('button');
removeButton.textContent = 'Remove Book';
removeButton.classList.add('remove-button');
removeButton.addEventListener('click', () => {
  bookCover.remove();
});
readingInfo.appendChild(startDateButton);
readingInfo.appendChild(finishDateButton);
readingInfo.appendChild(removeButton)
library.appendChild(bookCover);
;
};
