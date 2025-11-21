const express = require("express");
const connectDb = require("./config/database");

const app = express();

const User = require("./models/user");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.use("/admin/getAllData", async (req, res) => {
  res.send("✅ all data sent");
});

app.post("/signup", async (req, res) => {
  try {
    console.log("=== SIGNUP ROUTE HIT ===");
    validateSignUpData(req);

    // Destructure ALL fields from req.body, not just password
    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // const userObj = {
    //   firstName: "Test",
    //   lastName: "grover",
    //   emailId: "adilgro@gmail.com",
    //   password: "aachak",
    // };

    const userObj = req.body;

    console.log("Creating user with data:", userObj);

    // creating new instance of a user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
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

// login api

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // first check if password is valid using bcrypt
    // if password is valid create a jwt token using jwt.sign
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a jwt token  using jsw.sign
      const token = await jwt.sign({ _id: user._id }, "adil@123");

      console.log("toks", token);

      // adil@123 is the secretkey password only server knows that is  BE guy knows this is generally kept in env file
      // add the token to cookie and send the response back to user
      res.cookie("token", token);
      res.send("login successfull");
    } else {
      // ✅ Use return res.status() instead of throw
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("❌ Error in login route:", err);
    res.status(500).send("Server error during login");
  }
});

// get one user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log("aachakkEmail", userEmail);

  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("cannot find email");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
   

    // i donot have to make this db call again because in userAuth middleware 
    // i have already attached user ro request object 
    // const user = await User.findById(_id);

    const user = req.user
    

      res.send(user)
  } catch (err) {
    res.send(400).send("error", err.message);
  }
});

// feed api get api ,get all users from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete user from db
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted succesfully");
  } catch (err) {
    res.status("400").send("Spmething went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });

    res.send("User updated succesfully");
  } catch (err) {
    res.status("400").send("S0mething went wrong");
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
