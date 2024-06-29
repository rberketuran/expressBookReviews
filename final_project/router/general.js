const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  let filtered_users = users.filter((user) => username === user.username);
  if(filtered_users.length > 0) {
    return true;
  } else {
    return false;
  }
}
public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }

  if(doesExist(username)){
    return res.status(404).json({message: "User already exists!"});
  } else {
    users.push({"username": username, "password": password});
    console.log(users)
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(isbn in Object.keys(books)) {
    return res.status(200).send(books[isbn]);
  }
  return res.status(404).send("ISBN not found.");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  author = author.replace(/-/g, ' ');
  
  let keys = Object.keys(books)
  console.log(keys)

  for(let key of keys){
    if(books[key].author === author){
      return res.status(200).send(books[key]);
    }
  }
  return res.status(404).send("Author not found.");

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  title = title.replace(/-/g, ' ');

  let keys = Object.keys(books);

  for(let key of keys){
    if(books[key].title === title){
      return res.status(200).send(books[key]);
    }
  }
  return res.status(404).send("Title not found.");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn in Object.keys(books)){
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
