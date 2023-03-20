if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const session=require('express-session');
const flash=require('connect-flash');
const express=require("express");
const path=require("path");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const authroute=require('./routes/authroute');
const cookieParser=require("cookie-parser");


const dbUrl= process.env.DB_URL;
mongoose.connect(dbUrl);
//mongoose.connect('mongodb://localhost:27017/some');

const sessionConfig={
    name: "RegistrationSession",
    //secure:true,
    secret:process.env.Session_Secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};

const app=express();
app.use(flash());
app.use(session(sessionConfig));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.set('views',path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public"))); 
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>
{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});

app.use('/',authroute);

app.listen(9999,()=>
{
    console.log("Listening");
});