const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getBooksAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 100); 
    });
  };

  try {
    const data = await getBooksAsync();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });
  };

  try {
    const result = await getByISBN(isbn);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const getByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(book => book.author === author);
      matches.length ? resolve(matches) : reject("No books found for this author");
    });
  };

  try {
    const result = await getByAuthor(author);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  const getByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(book => book.title === title);
      matches.length ? resolve(matches) : reject("No books found with this title");
    });
  };

  try {
    const result = await getByTitle(title);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found" });
  }
});

module.exports.general = public_users;
