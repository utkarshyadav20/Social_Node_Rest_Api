const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const userAuth = require("./routes/auth");
const postRoute = require("./routes/posts");
// const multer = require("multer");
const path=require("path");


const app = express();
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "https://social-app-lilac-five.vercel.app", // Deployed frontend
  "https://master.d1c7vn6uncbq8z.amplifyapp.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies if needed
  })
);
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

app.use("/images",express.static(path.join(__dirname,"public/images")))

// middleware
app.use(express.json({limit: '50mb'}));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null,req.body.name);
//   },
// });

// const upload = multer({storage});

// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.status(200).json("file uploaded successfully");
//   } catch (err) {
//     console.log(err);
//   }
// });


app.get("/",(req,res)=>{
    res.json("hello");
})
app.use("/api/users", userRoute);
app.use("/api/auth", userAuth);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("running");
});