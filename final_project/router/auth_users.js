const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user) => {
      return (user.username === username && user.password === password);
    })

    if(validUsers.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});
  

  req.session.authorization = {
    accessToken, username
  }
  return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({ message: "Invalid Login. Check username and password" });

}


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  if(req.session.authorization){
    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
      if(!err){
        req.user = user;
        let isbn = req.params.isbn;
        let review = req.query.review;
        let username = req.session.authorization.username; 

        books[isbn].reviews[username] = review;
        return res.status(200).json({message: "Review successfully added"});
      } else {
        return res.status(403).json({ message: "User not authenticated" });

      }
    })
  }
  
  

  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
