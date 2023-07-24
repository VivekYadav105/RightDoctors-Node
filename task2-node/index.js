const express =require("express")
const flash = require("express-flash")
const session = require("express-session")
const pug = require("pug")
const bodyParser = require("body-parser")
const errroMiddleware = require("./middleware/errorMiddleware")
const userModel = require("./models/userModel")
const { default: mongoose } = require("mongoose")
require("dotenv").config()
const methodOveride = require("express-method-override") 
const path = require("path")


const app = express()
const PORT = process.env.PORT || 3000 

app.use(methodOveride("_method"))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());
app.use(errroMiddleware)
app.use(bodyParser.urlencoded({extended:true}))
app.set("/views",path.join(__dirname,"views"))
app.set("view engine","pug")

app.get("/",(req,res,next)=>{
    res.redirect("/list")
})

app.get("/list",async(req,res,next)=>{
    try{
        const users = await userModel.find({})
        if(!users.length){
            return res.render('list',{errMessage:"No users here",users:""})
        }
        return res.render("list",{errMessage:"",users:users})    
    }
    catch(err){
        console.log(err)
        next(err)
    }
})

app.post("/person",async(req,res,next)=>{
    try{
        const {name,mobileNo,gender,age} = req.body
        const mobileNumberPattern = /^\d{10,13}$/;
        if(mobileNumberPattern.test(mobileNo)){
            throw new Error("Not valid mobile No.")
        }
        console.log(req.body)
        if(!name||!mobileNo||!gender||!age){
            throw new Error("All details are mandatory")
        }
        const user = await userModel.create({name,mobileNo,gender,age})
        res.redirect("/list")
    }catch(err){
        next(err)
    }
})

app.get("/form",(req,res,next)=>{
    res.render("form")
})

app.post("/person/:id",async(req,res,next)=>{
    try{
        const userDetails = req.body
        const mobileNumberPattern = /^\d{10,13}$/;
        const {mobileNo} = req.body
        if(mobileNumberPattern.test(mobileNo)){
            throw new Error("Not valid mobile No.")
        }
        const {id} = req.params
        const user = await userModel.findByIdAndUpdate(id,userDetails)
        req.flash("success","User details changed successfully")
        res.redirect('/list')
    }catch(err){
        next(err)
    }
})

app.put("/person/:id",async(req,res,next)=>{
    try{
        const {id} = req.params
        const user = await userModel.findById(id)
        if(!user){
            //error handler for no user
        }
        res.render("form",{user:user})
    }catch(err){
        next(err)
    }
})

app.delete("/person/:id",async(req,res,next)=>{
    const {id} = req.params
    const user = await userModel.findByIdAndDelete(id)
    req.flash("success","User deleted successfully")
    res.redirect("/list")
})

mongoose.connect(process.env.MONGO_URI).then((succ)=>{
    console.log("connected successfully to "+succ.connection.host)
}).catch(err=>console.log(err))

app.listen(PORT,()=>{
    console.log("listening to port"+PORT)
})