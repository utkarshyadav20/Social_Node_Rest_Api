const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path=require("path");


const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Successfully"))

  .catch((err) => {
    console.log(err);
  });

  
  // middleware
  app.use(express.json());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan("common"));
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null,req.body.name);
    },
  });
  
  app.use("/images",express.static(path.join(__dirname,"public/images")))
const upload = multer({storage});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("file uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("running");
});