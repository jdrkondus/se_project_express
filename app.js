
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {errors} = require('celebrate');

const app = express();
const { PORT = 3001 } = process.env;


const { createUser, loginUser, getUsers, getCurrentUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const userRoutes = require('./routes/users');
const clothingItemRoutes = require('./routes/clothingItems');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');


app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', loginUser);
app.use('/', getCurrentUser, getUsers);

app.use('/items',  clothingItemRoutes);
app.use('/profile', auth, userRoutes);



app.use(errorLogger);

app.use(errors());
app.use(errorHandler);


mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

