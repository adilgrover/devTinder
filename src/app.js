const express = require("express");
const connectDb = require("./config/database");

const app = express();

const User = require("./models/user");

app.use("/admin/getAllData", async (req, res) => {
  res.send("✅ all data sent");
});

app.post("/signup", async (req, res) => {
  try {
    console.log("=== SIGNUP ROUTE HIT ===");
    
    const userObj = {
      firstName: "Test",
      lastName: "grover",
      emailId: "adilgro@gmail.com",
      password: "aachak",
    };

    console.log("Creating user with data:", userObj);

    // creating new instance of a user model
    const user = new User(userObj);
    console.log("User instance created");

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser._id);
    
    // Verify the user exists in database
    const foundUser = await User.findById(savedUser._id);
    console.log("User found in DB:", foundUser ? "YES" : "NO");
    
    res.send("User added successfully with ID: " + savedUser._id);
    
  } catch (error) {
    console.error("❌ Error in signup route:", error);
    res.status(500).send("Error: " + error.message);
  }
});

const startServer = async () => {
  try {
    // connect to DB first
    await connectDb();

    // start the server only after DB is connected
    app.listen(3000, () => {
      console.log("🚀 Server running successfullyyy on port 3000");
    });
  } catch (err) {
    console.error("💥 Failed to start server due to DB error.");
  }
};

startServer();
