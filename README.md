# Meal Sharing Backend

This is the backend service for the **Meal Sharing** application, which connects donors with food to people in need, aiming to reduce food surplus and waste. The backend is built with **Node.js** and **Express**, using **MongoDB** as the database.

## Live URL
The backend is hosted and available at:
[Share-A-Meal-Backend](https://share-a-meal-server.vercel.app)

---

## Purpose
This backend provides a secure and scalable API to manage food donations, requests, and user authentication. It supports CRUD operations for food items, authentication with JWT, and cookies for session management. The backend integrates seamlessly with the frontend of the Meal Sharing application.

---

## Key Features

### Authentication
- **JWT-Based Authentication**: Securely authenticate users and issue JWT tokens.
- **Token Management**: Tokens are stored in **http-only cookies** for enhanced security.

### Food Management
- **Add Foods**: Allows authenticated users to donate food items.
- **Get All Foods**: Fetch all available food items with search and sort functionality.
- **Get Single Food**: Retrieve detailed information about a specific food item.
- **Update Foods**: Update food details like status, donor, or requester.
- **Delete Foods**: Remove food items from the database.

### User-Specific Data
- **My Foods**: Fetch foods donated by the authenticated user.
- **My Requests**: Fetch foods requested by the authenticated user.

### Advanced APIs
- **Featured Foods**: Retrieve a list of top food donations for the homepage.
- **Cancel Request**: Allow users to cancel their food requests and reset the food status.

### Error Handling
- **Unauthorized Access**: Handles cases when a user tries to access restricted endpoints without a valid token.
- **Bad Request**: Validates inputs and handles missing parameters.

---

## API Endpoints

### Authentication
- **POST** `/jwt`: Issues a JWT token upon successful login.
- **POST** `/logout`: Logs the user out by clearing the token cookie.

### Food Management
- **POST** `/add-foods`: Adds a food item to the database (Authenticated).
- **GET** `/all-foods`: Retrieves all available food items (with optional search and sort).
- **GET** `/food/:id`: Fetches a single food item by ID.
- **PATCH** `/food/:id`: Updates a food item by ID (Authenticated).
- **DELETE** `/food/:id`: Deletes a food item by ID.

### User-Specific APIs
- **GET** `/my-foods`: Retrieves all foods donated by the authenticated user (Authenticated).
- **GET** `/my-requests`: Retrieves all foods requested by the authenticated user (Authenticated).

### Miscellaneous
- **PATCH** `/cancel-request/:id`: Cancels a food request and resets the food status.
- **GET** `/featured`: Retrieves top food donations for the homepage.

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database (Atlas or Local)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/meal-sharing-backend.git
   cd meal-sharing-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following environment variables:
   ```env
   PORT=9000
   DB_USER=<your-mongodb-username>
   DB_PASS=<your-mongodb-password>
   ACCESS_TOKEN_SECRET=<your-jwt-secret>
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

---

## Dependencies

- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)**: Parse cookies for managing http-only JWTs.
- **[cors](https://www.npmjs.com/package/cors)**: Enable cross-origin resource sharing.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Manage environment variables securely.
- **[express](https://www.npmjs.com/package/express)**: Web framework for Node.js.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Manage authentication tokens.
- **[mongodb](https://www.npmjs.com/package/mongodb)**: Connect and interact with MongoDB.

---

## Development
### Running in Development Mode
Start the server in development mode with:
```bash
npm run dev
```
The server will reload automatically on code changes.

---

## Future Enhancements
- Add support for email notifications.
- Implement analytics for food donations and requests.
- Optimize API responses with pagination.

---

## Contact
For questions or feedback, please reach out at [shahreza.dev@gmail.com](mailto:shahreza.dev@gmail.com).

