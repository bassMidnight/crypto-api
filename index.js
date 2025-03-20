const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const accountRoutes = require("./routes/account.routes");
const currencyRoutes = require("./routes/currency.routes");

const { syncDatabase } = require("./models");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/currency", currencyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
  });
});
