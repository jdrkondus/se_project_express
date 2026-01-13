
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const app = express();
const { PORT = 3001 } = process.env;
const userRoutes = require('./routes/users');
const clothingItemRoutes = require('./routes/clothingItems');


app.use((req, res, next) => {
  req.user = {
    _id: "69658364a3a449e5f2e3bfac"
  };
  next();
});

app.use(express.json());
app.use(userRoutes);
app.use(clothingItemRoutes);

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db');



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).send({
    message: "Requested resource not found"
  });
});

