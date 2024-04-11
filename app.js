require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path=require('path');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');


const app = express();
const PORT = process.env.PORT;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DataBase Connected")
}).catch((error)=>{
    console.log("Error in DB Connection: ", error)
});

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});

    res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
    console.log(`Server started at Port: ${PORT}`);
});