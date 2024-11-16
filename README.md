# Email Sequence App
### This is email sequence app where you can schedule emails in sequence by using reactflow and nodemailer libraries.

## Table of Contents
- Features
- Technologies
- Project Setup
- Environment Variables
- Running the Application

## Features
* User Authentication: Secure login system using JWT tokens.
* Create nodes for scheduling emails
* Error Handling: Proper error messages for invalid inputs or missing fields.

## Technologies
+ Frontend: React, Tailwind, ReactFlow
+ Backend: Node.js, Express.js, Mongoose, Nodemailer, Agenda
+ Database: MongoDB
+ Authentication: JWT for user authentication
+ Other Libraries:
  1. bcryptjs: For hashing passwords.
  2. dotenv: For environment variable management.
  3. cookie-parser: For handling cookies.
  4. react-hot-toast: For pop-ups.

## Project Setup

**Installation**
Clone the repository:

```
git clone https://github.com/kumar4532/emailSequence.git
```

Install dependencies:
```
npm install
```

Create a .env file in the root directory and add the following variables (see the Environment Variables section below).

Ensure MongoDB is running either locally or through a service like MongoDB Atlas.

### Environment Variables
Create a .env file in the root of your project and set the following variables:

```
PORT=<Any port>
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT secret key>

SMTP_HOST=<SMTP HOST>
SMTP_PORT=<Your SMTP port>
SMTP_USER=<SMTP username>
SMTP_PASS=<SMTP password>


EMAIL_USER=<Your email address>
EMAIL_PASS=<Your generated password>
```

## Running the Application

Start the server in development mode:
```
npm run dev
```
This will run the server using nodemon, which automatically restarts the server upon file changes.

Start the server in production mode:
```
npm start
```

Build the application:
```
npm run build
```