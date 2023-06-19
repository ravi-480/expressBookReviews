const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// TASK 10 Get book details based on ISBN using Promises

public_users.get("/async-get-books", (req, res) => {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({ books }, null, 4)));
  });
  get_books.then(() => console.log("Promise for task 10 resolved"));
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});


// TASK 11 Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn', function (req, res) { 
  const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
   
    if (req.params.isbn <= 10) {
    resolve(res.send(books[isbn]));
    }
    else {
    reject(res.send('ISBN not found'));
    }
    });
    get_books_isbn.
    then(function(){
    console.log("Promise for Task 11 is resolved");
    }).
    catch(function () {
    console.log('ISBN not found');
    });
    });

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  var filtered_book;
  let i = 1;
  while (books[i]) {
    if (books[i]["author"] === author) {
      filtered_book = books[i];
      break;
    }
    i++;
  }
  res.send(filtered_book);
});

// TASK 12 Get book details based on author

public_users.get("/books/author/:author", function (req, res) {
  const get_books_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({
          isbn: isbn,
          title: books[isbn]["title"],
          reviews: books[isbn]["reviews"],
        });
        resolve(res.send(JSON.stringify({ booksbyauthor }, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "));
  });
  get_books_author
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned author does not exist");
    });
});

// Getting books detail based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  var filtered_book;
  let i = 1;
  while (books[i]) {
    if (books[i]["title"] === title) {
      filtered_book = books[i];
      break;
    }
    i++;
  }
  res.send(filtered_book);
});

// Getting book details based on title using promise callbacks

public_users.get("/books/title/:title", function (req, res) {
  const get_books_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({
          isbn: isbn,
          author: books[isbn]["author"],
          reviews: books[isbn]["reviews"],
        });
        resolve(res.send(JSON.stringify({ booksbytitle }, null, 4)));
      }
    });
    reject(res.send("The mentioned author does not exist "));
  });
  get_books_title
    .then(function () {
      console.log("Promise is resolved");
    })
    .catch(function () {
      console.log("The mentioned author does not exist");
    });
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
