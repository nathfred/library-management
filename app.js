const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const memberRoutes = require('./routes/memberRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const swaggerSpec = require('./swaggerConfig'); // Import the Swagger configuration

// Middleware to handle JSON data
app.use(bodyParser.json());

// Middleware to handle url-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/members', memberRoutes);
app.use('/books', bookRoutes);

// Swagger for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));