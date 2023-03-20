const express= require('express');
const bcrypt=require('bcrypt');
const Course=require('../models/Course');
const Student=require('../models/Student');
const Admin=require('../models/Admin');
const router=express.Router();
const { createTokens, validateTokenStudent, validateTokenAdmin } = require("../JWT");
router.use(express.json());


router.get('/',(req,res)=>
{
    res.render('../views/landing.ejs')
});

router.get("/adminAuth",(req,res)=>
{
    res.render('../views/adminAuth.ejs')
});

router.get("/auth",(req,res)=>
{
    res.render('../views/studentAuth.ejs')
});

router.post('/auth',async(req,res)=>
{
    const { regNo, password } = req.body;
    const student = await Student.findOne({ regNo: regNo }).exec();
    if (!student) 
    { req.flash('success',"The student does not exist!");
    res.redirect("/auth");
    }
    const dbPassword = student.password;
    const match=bcrypt.compare(dbPassword,password);
    if(!match)
    {
    req.flash('success',"The register number and password doesn't match!");
    res.redirect("/auth");
    }
    else
     {
        const accessToken = createTokens(student);
  
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.redirect("/dashboardStudent");
    }
});

router.get("/register",(req,res)=>
{
    res.render('../views/register.ejs')
});

router.get("/dashboardStudent", validateTokenStudent,async(req,res)=>
{
  const courses= await Course.find({});
  const student = await Student.findOne({ regNo: req.user.regNo }).exec();
  res.render("../views/studentDashboard.ejs",{courses,student});
});

router.post("/dashboardStudent", validateTokenStudent,async(req,res)=>
{
 try{
    const{course}=req.body;
    var exist;
    const student = await Student.findOne({ regNo: req.user.regNo }).exec();
    for(let x of student.courses )
    {
        if(x===course)
        {
            exist=true;
        }
    }
    if(!exist)
    {
        await Student.updateOne({ regNo: req.user.regNo },{$push:{ courses : course}});
        req.flash('success',"Successfully Applied!");
        res.redirect("/dashboardStudent");
    }
    else{
    req.flash('success',"Course already exists!");
    res.redirect("/dashboardStudent");}
 }
 catch(e)
 {
    res.send(e.message);
 }
  
});

router.get("/removestudent",async(req,res)=>
{
    const students= await Student.find({});
    res.render("removeStudent.ejs",{students});
});

router.post("/removeStudent",async(req,res)=>
{
  try{
    const {student}= req.body;
    const _student = await Student.findOne({  name: student }).exec();
    await Student.deleteOne(_student);
    req.flash('success',"Student removed!");
    res.redirect("/dashboardAdmin");
  }
  catch(e)
  {
    res.send(e.message);
  }
});

router.post("/register",async(req,res)=>
{
  try{
    const {name,regno,date,password}=req.body;
  const hash = await bcrypt.hash(password,12);
  const student =new Student({
    name:name,
    regNo:regno,
    password:hash,
    dob:date
});
await student.save();
req.flash('success',"Successfully created!");
res.redirect("/auth");
  }
  catch(e)
  {
    req.flash('success',e.message);
    res.redirect("/register");
  }
});


router.get("/logout",(req,res)=>
{
  res.cookie("access-token",'',{maxAge:1});
  res.redirect('/');
});

router.get("/secret",(req,res)=>
{
  res.render("../views/secret.ejs");
});

router.post("/secret",async(req,res)=>
{
  try{
    const { username,password} = req.body;
  const hash = await bcrypt.hash(password,12);
  const admin =new Admin({
    username:username,
    password:hash
});
await admin.save();
req.flash('success',"Successfully created!");
res.redirect("/adminAuth");
  }
  catch(e)
  {
    req.flash('success',e.message);
    res.redirect("/secret");
  }

});

router.post('/adminAuth',async(req,res)=>
{
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username }).exec();
    if (!admin) 
    { req.flash('success',"The admin does not exist!");
    res.redirect("/adminAuth");
    }
    const dbPassword = admin.password;
    const match=bcrypt.compare(dbPassword,password);
    if(!match)
    {
    req.flash('success',"The Username and password doesn't match!");
    res.redirect("/adminAuth");
    }
    else
     {
        const accessToken = createTokens(admin);
  
        res.cookie("admin-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });
        res.redirect("/dashboardAdmin");
    }
});

router.get("/dashboardAdmin",validateTokenAdmin,async(req,res)=>
{
  const courses= await Course.find({});
  const students= await Student.find({});
  res.render("admindashboard.ejs",{courses,students});
});

router.get("/logoutAdmin",(req,res)=>
{
    res.cookie("admin-token",'',{maxAge:1});
    res.redirect('/');
});

router.get("/createCourse",(req,res)=>
{
    res.render("createCourse.ejs");
});

router.get("/deleteCourse",async(req,res)=>
{
    const courses= await Course.find({});
    res.render("deleteCourse.ejs",{courses});
});

router.post("/deleteCourse",async(req,res)=>
{
  try{
    const { course }= req.body;
    await Course.deleteOne({ name: course });
    req.flash('success',"Successfully deleted!");
    res.redirect("/dashboardAdmin");
  }
  catch(e)
  {
    res.send(e.message);
  }
});

router.post("/createCourse",async(req,res)=>
{
    try{
        const { name,teacher} = req.body;
      const course =new Course({
        name:name,
        teacher:teacher
    });
    await course.save();
    req.flash('success',"Successfully created!");
    res.redirect("/dashboardAdmin");
      }
      catch(e)
      {
        req.flash('success',e.message);
        res.redirect("/createCourse");
      }
    
});

module.exports=router;