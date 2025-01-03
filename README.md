
# Multi-Portal Job Posting System

This is a REST API system built using Express.js and Sequelize to manage job postings across multiple job portals.

## Features
- CRUD operations for managing job postings.
- Database interaction using Sequelize ORM.
- API documentation using Swagger UI.
# Express.js with Sequelize Setup

This project is a basic setup of an **Express.js** application using **Sequelize** as the ORM for interacting with a MySQL database. Environment variables are stored in a `.env` file for sensitive information such as database credentials.

## Installation

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (>= 14.0.0)
- **MySQL** (or any other database you plan to use)

### Steps to Set Up

1. **Clone the repository** (or create a new project directory):
    ```bash
    git clone <repository_url>
    cd my-express-sequelize-project
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory:
```NODE_ENV =development
PORT=9000
USER_USERNAME=admin
HASHED_PASSWORD=$2a$12$Yh1rhF2ZSH55Emaxmv8fj.F8QWbHk4O3IlQAsQ2e2M40gRvRhL.Ma 
JWT_SECRET=job@saeerjsjdhr
USER_PASSWORD=admin123
```

4. **Migration run**:
```bash
  npx sequelize-cli db:migrate
```

5. **Run the Application**:
    - To run the app in development mode, use the following command:
    ```bash
    npm run dev
    ```

    This will start the server at `http://localhost:9000`.
    ```
    
6. **Access Swagger API Documentation**:
    - Open your browser and visit `http://localhost:9000/api-docs` to view the interactive Swagger API documentation.
    - You can test your API endpoints directly from the Swagger UI.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
