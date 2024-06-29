require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Corrected path to import sequelize
const cors = require('cors');
const path = require('path');

const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
// const patientRoutes = require('./routes/patientRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/patient', patientRoutes);

// Sync Database
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define routes here
// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 9095;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
