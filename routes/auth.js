const router = require("express").Router();
const User = require("../models/user");
const bcrypt=require("bcrypt")

//Register
router.post("/register", async (req, res) => {
  try {
    //generate new password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // User not found
      return res.status(404).json("User not found");
    }

    if (req.body.password !== user.password) {
      // Incorrect password
      return res.status(400).json("Wrong password");
    }

    // Successful login
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

 
// router.get("/",(req,res)=>{
//     res.send("hey its auth routes");
//  })

module.exports = router;








  