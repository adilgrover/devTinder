const jwt = require("jsonwebtoken");

const User = require("../models/user")

const userAuth = async (req, res, next) => {
  // read the token from the req cookies
  try {
    const { token } = req.cookies;

    if(!token){
          // ✅ Use return res.status() instead of throw
      return res.status(401).json({ error: "Token is not present" });
        // throw new Error("Token is not Present")
    }
    const decodedObj =  jwt.verify(token, "adil@123");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }

    // I can now attach user to request object 

     req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error", err.message);
  }
};


module.exports ={
    userAuth
}