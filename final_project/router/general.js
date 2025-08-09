const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if user doesn't already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User succesfully registered."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }   
    return res.status(404).json({message: "Unable to register user."});
});

function getAvailableBooks() {
    return myPromise = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        }
    });
};

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const data = await getAvailableBooks();
        return res.status(200).send(JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error fetching data: ', error);
        return res.status(500).send("Unable to fetch available books");
    }
});

function getBooksByISBN(isbn) {
    return myPromise = new Promise((resolve, reject) => {
        if (isbn) {
            resolve(books[isbn]);
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    try {
        const book = await getBooksByISBN(isbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        console.error('Unable to fetch data: ', error);
        return res.status(500).send(`Unable to fetch book with isbn ${isbn}`);
    }
});

function getBookByAuthor(author) {
    return myPromise = new Promise((resolve, reject) => {
        // Get keys of books object 
        let index = Object.keys(books);
        // Empty array to store found books
        let bookFound = [];
        // Cycle through books object by index
        index.forEach((id) => {
            if (author === books[id].author) {  // Find book that matches the author in request
                bookFound.push(books[id]);
            } else {
                message = "Book not found";
            }
        })

        if (bookFound.length === 1) {
            resolve(bookFound[0]);          /* In case there's       */                                                   
        } else if (bookFound.length > 1) {  /* only one book found, display as dictionary.*/
            resolve(bookFound);             /* In case there are more than 1 book found, */
        } else {                            /* display list of dictionaries.*/
            reject("Book not found");
        }
    })
}
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    //Write your code here
    const author = req.params.author;
    try {
        const book = await getBookByAuthor(author);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        console.error('Unable to fetch data: ', error);
        return res.status(500).send(`Unable to get book from ${author}`);
    }
});

function getBookByTitle(title) {
    return myPromise = new Promise((resolve, reject) => {
        // Get keys of books object
        let index = Object.keys(books);

        let bookFound = '';
        
        index.forEach((id) => {
            if (title === books[id].title) {
                bookFound = books[id];
            }
        })
        if (bookFound) {
            resolve(bookFound);
        } else {
            reject("Book not found");
        }
    })
}
// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    
    const title = req.params.title;
    try {
        const book = await getBookByTitle(title);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        console.error('Unable to fetch data: ', error);
        return res.status(500).send(`Unable to get book: ${title}`)
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    let reviews = books[isbn].reviews;

    return res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
