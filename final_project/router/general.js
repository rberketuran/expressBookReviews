const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  let filtered_users = users.filter((user) => username === user.username);
  if (filtered_users.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (doesExist(username)) {
    return res.status(404).json({ message: "User already exists!" });
  } else {
    users.push({ "username": username, "password": password });
    console.log(users)
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  }
});

const fetchBooksFromDatabase = async () => {
  // Simulating a database fetch operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate a delay of 1 second
  });
};

const getBookByIsbn = async (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 1000)
  });
};



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    let books = await fetchBooksFromDatabase();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    if (isbn in Object.keys(books)) {
      let book = await getBookByIsbn(isbn);
      return res.status(200).send(book);
    }
    return res.status(404).send("ISBN not found.");
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

const fetchBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { 
      let keys = Object.keys(books);

      for (let key of keys) {
        if (books[key].author === author) {
          resolve(books[key]);
          return;
        }
      }
      reject("Author not found.");
    }, 1000); 
  });
};


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  author = author.replace(/-/g, ' ');

  fetchBookByAuthor(author)
    .then(book => {
      return res.status(200).send(book);
    })
    .catch(err => {
      return res.status(404).send(err);
    });
});


const fetchBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=> {
      let keys = Object.keys(books);

      for(let key of keys) {
        if(books[key].title === title) {
          resolve(books[key]);
          return;
        }
      }
      reject("Title not found");
    }, 1000);
  });
};

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  title = title.replace(/-/g, ' ');

  fetchBookByTitle(title)
    .then(book => {
      return res.status(200).send(book);
    })
    .catch(err => {
      return res.status(404).send(err);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (isbn in Object.keys(books)) {
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
