const express = require("express");
const app = express();
const cors = require("cors");
const db=require('./helper/dbConnect');
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
app.use(express.json());
app.use(cors());
app.use(cookieParser())
db();

app.use(morgan('dev'));

app.use("/auth",authRouter);
app.use("/user",userRouter);
app.get("/", function(req, res) {
    console.log("Hello World salim from app.js");
    return res.send("Hello World salim");
});

app.listen(3000, function(){
    console.log('Listening on port 3000');
});