const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express server
const app = express();
app.use(cors());
app.use(express.json());
// Connect to MongoDB using connection string
mongoose
  .connect(
    "mongodb+srv://rindulkar2003:6qauE8GyxTwOJoAr@cluster0.tujxoed.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define account schema
const accountSchema = new mongoose.Schema({
  name: String,
  email: String,
  code: String,
  password: String,
});

// Create account model
const Account = mongoose.model("Account", accountSchema);

// API for creating an account
app.post("/api/account", (req, res) => {
  console.log("post api", req.body);
  const { name, email, code, password } = req.body;

  // Create a new account
  const account = new Account({ name, email, code, password });

  // Save the account to the database
  account
    .save()
    .then(() => {
      res.status(201).json({ message: "Account created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create account" });
    });
});

// API for logging in
app.post("/api/login", (req, res) => {
  const { name, password } = req.body;
  console.log(name, password);
  Account.findOne({ name: name })
    .then((account) => {
      if (account) {
        console.log("account:", account);
        if (account.password === password) {
          res.status(200).json({ message: "Login successful" });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to find account" });
    });

  // Implement login logic here
});

// API for password reset
app.post("/api/reset-password", (req, res) => {
  const { name, code, password } = req.body;
  Account.findOne({ name: name }).then((account) => {
    if (account) {
      console.log("account:", account);
      if (account.code === code) {
        // Update the account's password
        account.password = password;

        // Save the updated account to the database
        account
          .save()
          .then(() => {
            res.status(200).json({ message: "Password updated successfully" });
          })
          .catch((error) => {
            res.status(500).json({ error: "Failed to update password" });
          });
      } else {
        res.status(401).json({ error: "Invalid code" });
      }
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  });

  // Implement password reset logic here
});
app.post("/api/delete", (req, res) => {
  const { name, password } = req.body;
  Account.findOne({ name: name }).then((account) => {
    if (account) {
      console.log("account:", account);
      if (account.password === password) {
        // Update the account's password
        account.password = password;

        // Save the updated account to the database
        account
          .deleteOne()
          .then(() => {
            res.status(200).json({ message: "Account deleted successfully" });
          })
          .catch((error) => {
            res.status(500).json({ error: "Failed to delete account" });
          });
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  });

  // Implement password reset logic here
});

// Start the server
app.listen(8888, () => {
  console.log("Server started on port 8888");
});
