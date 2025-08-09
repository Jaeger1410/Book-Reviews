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

async function getAvailableBooks(req, res) {
    let response = await axios.get('https://cortespoblet-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
        .then(response => {
            console.log(response.data);
            //res.status(200).send(JSON.stringify(response.data, null, 4));
        })
        .catch(error => {
           // res.status(404).send("Unable to fetch data: ", error);
        });
        return response;
};
getAvailableBooks()

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    //let availableBooks = null;
    getAvailableBooks().then(response => {
        res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
        res.status(500).send("Unable to fetch", error)
    })
       
    return res.send(JSON.stringify(books, null, 4)); 

});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    let filtered_book = books[isbn];
    
    return res.status(200).send(JSON.stringify(filtered_book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    
    // Get keys of object books
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
        return res.send(JSON.stringify(bookFound[0], null, 4)); /* In case there's       */                                                   
    } else if (bookFound.length > 1) {                          /* only one book found, display as dictionary.*/
        return res.send(JSON.stringify(bookFound, null, 4));    /* In case there are more than 1 book found, */
    } else {                                                     /* display list of dictionaries.*/
        return res.send(message);
    }
    
    //return res.send(JSON.stringify(bookFound, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    const title = req.params.title;

    let index = Object.keys(books);

    let bookFound = '';
    
    index.forEach((id) => {
        if (title === books[id].title) {
            bookFound = books[id];
        } else {
            message = "Book not found";
        }
    })

    if (bookFound) {
        return res.send(JSON.stringify(bookFound, null, 4));
    } else {
        return res.send(message);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;

    let reviews = books[isbn].reviews;

    return res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
