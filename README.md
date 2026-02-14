# WTWR (What to Wear?): Back End

## Description 

This project is to develop the backend systems for my WTWR app. It will allow for users to be created and logged in. It will also implement authentication to keep users information safe on the server.

## Links

- **Frontend Repository**: [WTWR Frontend](https://github.com/jdrkondus/se_project_react)
- **Project Pitch Video**: [Add video link here] 

## Technologies and Techniques

### Backend Framework
- **Express.js** (v4.22.1) - A minimal and flexible Node.js web application framework used to build the REST API and handle HTTP requests/responses

### Database
- **MongoDB** - A NoSQL document database used to store user and clothing item data
- **Mongoose** (v8.21.0) - An Object Data Modeling (ODM) library for MongoDB that provides schema validation and database interaction utilities

### Security & Authentication
- **bcryptjs** (v2.4.3) - Library for hashing passwords securely before storing them in the database
- **jsonwebtoken** (v9.0.0) - Implementation of JSON Web Tokens (JWT) for secure user authentication and authorization
- **cors** (v2.8.5) - Middleware for enabling Cross-Origin Resource Sharing (CORS) to allow frontend-backend communication

### Validation & Request Processing
- **Validator** (v13.15.26) - Library for string validation and sanitization (used for email, URL, and data validation)
- **Celebrate** (v15.0.3) - Middleware for request validation using Joi schemas, ensuring data integrity before processing

### Logging
### Configuration
- **dotenv** (v17.2.3) - Loads environment variables from .env files for secure configuration management

### Development Tools
- **Node.js** - JavaScript runtime environment for server-side execution
- **Nodemon** (v3.1.11) - Development utility that automatically restarts the server when file changes are detected
- **Cross-env** (v10.1.0) - Cross-platform environment variable management for consistent development across Windows, Mac, and Linux

### Code Quality & Linting
- **ESLint** (v8.57.1) - JavaScript linter for identifying and fixing code style issues
- **ESLint Config Airbnb Base** - Airbnb's ESLint configuration for enforcing code standards
- **Prettier** (v2.8.8) - Code formatter for consistent code formatting
- **ESLint Config Prettier** - Resolves conflicts between ESLint and Prettier rules

### Validation
- **Validator** (v13.15.26) - Library for string validation and sanitization (used for email, URL, and data validation)

### Project Structure
- **Models** - Mongoose schemas for Users and Clothing Items
- **Controllers** - Business logic for handling requests
- **Routes** - API endpoint definitions
- **Middlewares** - Custom middleware functions for request processing
- **Utils** - Utility functions including error handling
