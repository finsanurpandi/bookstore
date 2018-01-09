const config = require('../../config.js');
const Book = require('../model/book.js');
const User = require('../model/user.js');
const jwt = require('jsonwebtoken');
const secretKey = config.secretKey;

function createToken(user)
{
  var token = jwt.sign({
    id: user._id,
    name: user.name,
    username: user.username
  }, secretKey, {
    expiresIn: 60*60*24
  });

  return token;
}

module.exports = (express) => {
  const api = express.Router();

  // get all books
  api.get('/books', (req, res) => {
    Book.find({}, (err, books) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.json(books);
      }
    })
  });

  // get all books using id
  api.get('/books/user/:id', (req, res) => {
    User.findOne({
      _id : req.params.id
    }).select('name username password').exec( (err, user) => {
      if (err) throw err;

      if (!user) {
        res.send({ message: 'User doesnt exist'});
      } else if (user) {
        Book.find({}, (err, books) => {
          if (err) {
            res.send(err);
            return;
          } else {
            res.json(books);
          }
        });
      }
    })
  });

  // get single book
  api.get('/books/:id', (req, res) => {
    Book.findOne({ _id: req.params.id }, (err, books) => {
      if (err) {
        res.send(err);
        return;
      } else {
        res.json(books);
      }
    })
  });

  // add new book
  api.post('/addbook', (req,res) => {
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      year: req.body.year,
      isbn: req.body.isbn,
      cover: req.body.cover,
      category: req.body.category
    });

    book.save((err, book) => {
      if (err) {
        res.send(err);
        return;
      }

      res.json({
        success: true,
        message: 'Book has been added',
        detail: book
      });

      res.status(200);
    });

  });

  // update book's detail
  api.put('/books/update/:id', (req, res) => {
    Book.findOne({ _id: req.params.id }, (err, book) => {
      if (err) {
        return res.send(err);
      }

      for (prop in req.body){
        book[prop] = req.body[prop];
      }

      book.save((err, book) => {
        if (err) {
          res.send(err);
          return;
        }

        res.json({
          success: true,
          message: 'Book has been updated',
          detail: book
        });
      });

    });
  });

  // delete book
  api.delete('/books/delete/:id', (req, res) => {
    Book.remove({ _id: req.params.id }, (err, book) => {
      if (err) {
        return res.send(err);
      }

      res.json({ message: 'The book has been deleted'});
    });
  });

  // register user
  api.post('/signup', (req, res) => {
    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    var token = createToken(user);

    user.save((err) => {
      if (err) {
        res.send(JSON.stringify({ error : { message : err.message, stack : err.stack } }));
        return;
      }

      res.json({
        success: true,
        message: 'User has been added',
        token: token,
        user: user
      });
    });
  });

  // Login user
  api.post('/login', (req, res) => {
    User.findOne({
      username: req.body.username
    }).select('name username password').exec((err, user) => {
      if (err) throw err;

      if (!user) {
        res.send({ message: "user doesn't exist. Have you signed up?"});
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);

        if (!validPassword) {
          res.send({ message: "invalid password"});
        } else {
          var token = createToken(user);

          res.json({
            success: true,
            message: 'Congratulation, you have been successfully login',
            token: token,
            user: user
          });

          console.log(user.username + " just logged in ");
        }
      }
    })
  });

  // Middleware
  api.use(function(req, res, next){
    console.log(req.body.username +' just came to our api');

    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, secretKey, function(err, decode){
        if (err) {
          res.status(403).send({ success: false, message: "Failed to authenticated user" });
        } else {
          req.decode = decode;
          next();
        }
      });
    } else {
      res.status(403).send({ success: false, message: "No token provided"});
    }

  });
  // api.use(function (req, res, next) {
  //   console.log('Time:', Date.now());
  //   next();
  // });

  return api;
}
