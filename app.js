const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./routes/authenticaion');
const eventsRoutes = require('./routes/event');
const reservationsRoutes = require('./routes/reservation');
const eventTypesRoutes = require('./routes/eventType');

mongoose.set('useFindAndModify', false);

require('dotenv/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', authRoute);
app.use('/events', eventsRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/eventType', eventTypesRoutes);

mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, () =>
  console.log('Connected to db...')
);

app.listen(3000, () => console.log('Server Up and running...'));
