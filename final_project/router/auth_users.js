const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid

    let validUser = users.filter((user) => {
        return (user.username === username);
    })
    //console.log("isValid output: ", validUser)

    if (validUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (isValid(username)) {
        if (authenticatedUser(username,password)) {
            let accessToken = jwt.sign({
                data: username
            }, 'access', { expiresIn: 60 * 60});

            // Stores access token and username in session
            req.session.authorization = {
                accessToken, username
            };
            return res.status(200).send("User succesfully logged in");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check your password" });
        }   
    } else {
        return res.status(408).send("Username doesn't exist!");
    } 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization['username'];
    
    let postedReviews = books[isbn].reviews;
    let reviewToPost = {
        "review": review
    };
    let reviewIndex = Object.keys(postedReviews);

    // Search for username in existing reviews
    let userFound = reviewIndex.find(user => user === username);
    if (userFound) {
        if (postedReviews[username].review === reviewToPost.review) {
            return res.status(300).send("Review already exists");
        } else {
            postedReviews[username] = reviewToPost;
            console.log(postedReviews);
            return res.status(200).send(`Review for ${books[isbn].title} updated`)
        }
        
    } else {
        postedReviews[username] = reviewToPost;
        console.log(postedReviews);
        return res.status(200).send(`Review for ${books[isbn].title} succesfully added`)
    }
   // } else {
   //     books[isbn].reviews[username] = {
    //        "review": review
    //    };
    //    console.log(books[isbn].reviews);
     //   return res.status(200).send(`Review for ${books[isbn].title} succesfully posted`)
   // } 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
