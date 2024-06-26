const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandlerMiddleware");
const {userRoutes, authRoutes, emailRoutes} = require("./routes");


const app = express();

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: process.env.APP_URL, // Replace with your frontend's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204
}));


// Session middleware
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));


// Error handling middleware should be last before the routes, after all other middleware
app.use(errorHandler);

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);

// Database connection and server initialization
const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });