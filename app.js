
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const { PORT = 3001 } = process.env;


const { createUser, loginUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const userRoutes = require('./routes/users');
const clothingItemRoutes = require('./routes/clothingItems');

app.use(cors());
app.use(express.json());



// Mock user middleware - allows tests to reach protected routes
// app.use((req, res, next) => {
//   req.user = {
//     _id: "69658364a3a449e5f2e3bfac"
//   };
//   next();
// });

app.post('/signup', createUser);
app.post('/signin', loginUser);

app.use('/items',  clothingItemRoutes);
app.use('/', auth, userRoutes);


// 404 handler - must come after all other routes
app.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found"
  });
});

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

