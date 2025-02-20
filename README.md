# Kapusta Backend

## 🛠️ Tech Stack

This is the backend repository for the Kapusta project.

🔗 [Check out the repository](https://github.com/DimaSomik/Kapusta_Backend)

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

This is the frontend repository for the Kapusta project.

🔗 [Check out the repository](https://github.com/DimaSomik/Kapusta_Frontend)

## Description

Kapusta Backend is the server-side application for the Kapusta project, handling authentication, transactions, and data management. It provides RESTful APIs for the frontend to interact with.

## Tech Stack

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for Node.js
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (JSON Web Token)** – Authentication
- **Dotenv** – Environment variable management
- **Cors** – Middleware for handling CORS
- **Bcrypt.js** – Password hashing

## Installation

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/DimaSomik/Kapusta_Backend.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd Kapusta_Backend
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Create a `.env` file** and set the following environment variables:
   ```sh
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
5. **Start the server:**

   ```sh
   npm run dev

   - The backend will run on `http://localhost:3000/`.
   - Dokumentacja API Swagger: `http://localhost:3000/api-docs/`

   ```

## Deployment

The Kapusta application is deployed and can be accessed at the following link:

🔗 [Kapusta Application](https://kapusta-fnr2.onrender.com/)

Visit the link to use the live version of the application.

## API Endpoints

### Authentication

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Log in an existing user
- `POST /api/auth/logout` – Log out user

### Transactions

- `GET /api/transactions` – Get user transactions
- `POST /api/transactions` – Add a new transaction
- `DELETE /api/transactions/:id` – Delete a transaction

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DimaSomik">
        <img src="https://github.com/DimaSomik.png?size=100" width="100px;" style="border-radius: 50%;" alt="Dima Somik"/>
        <br /><b>Dima Somik</b>
      </a>
      <br />Team Leader
    </td>
    <td align="center">
      <a href="https://github.com/Piter30">
        <img src="https://github.com/Piter30.png?size=100" width="100px;" style="border-radius: 50%;" alt="Piter30"/>
        <br /><b>Piotr Kowalski</b>
      </a>
      <br />Back-End Developer
    </td>
    <td align="center">
      <a href="https://github.com/AlicjaSzamraj">
        <img src="https://github.com/AlicjaSzamraj.png?size=100" width="100px;" style="border-radius: 50%;" alt="Alicja Szamraj"/>
        <br /><b>Alicja Szamraj</b>
      </a>
      <br />Back-End Developer
    </td>
    <td align="center">
      <a href="https://github.com/MagdalenaSiniawska">
        <img src="https://github.com/MagdalenaSiniawska.png?size=100" width="100px;" style="border-radius: 50%;" alt="Magdalena Siniawska"/>
        <br /><b>Magdalena Siniawska</b>
      </a>
      <br />Back-End Developer
    </td>

  </tr>
</table>
```
