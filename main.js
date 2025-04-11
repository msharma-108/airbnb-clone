const path=require("path")
const express=require("express")
const { default: mongoose } = require("mongoose")
const session= require("express-session")
const mongodbstore=require("connect-mongodb-session")(session)
const multer=require("multer")
require('dotenv').config();

const DBPATH='mongodb://127.0.0.1:27017/airbnb'
const app=express()


const store=new  mongodbstore({
    uri:DBPATH,
    collection:"sessions"
})
app.use(session({
    secret:"mysecret_123",
    resave:false,
    saveUninitialized:true,
    store:store
}))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))


const homerouter=require("./Routes/home")
const storerouter=require("./Routes/storeroutes")
const hostrouter=require("./Routes/hostroutes")
const authrouter=require("./Routes/authrouter")

const errorcontroller=require("./controllers/error")
const randomstring=(length)=>{
    const chars="abcdefghijklmnopqrstuvwxyz"
    let result=""
    for(let i=0;i<length;i++)   result+=chars.charAt(Math.floor(Math.random()*chars.length))
        return result

}//creating for unique file names
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,randomstring(10)+"-"+file.originalname)
    }
})
const filefilter=(req,file,cb)=>{
    if(file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const multeroptions={
    storage,filefilter
}


app.use(express.static(path.join(__dirname,"public")))
app.use("*/uploads",express.static(path.join(__dirname,"uploads")))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(multer(multeroptions).single("image"))
app.use((req,res,next)=>{ 
    console.log(req.url,req.method)
    next();
})

app.use((req,res,next)=>{
    req.isloggedin=req.session.isloggedin 
    next()
})
app.use((req,res,next)=>{
    if((req.isloggedin==undefined && (req.url!="/checkout" && req.url!="/" && req.url!="/login" && req.url!="/signup")) || (req.isloggedin==true && (req.url=="/login" || req.url=="/signup"))){
        return res.redirect("/")
    } 
    next()
})
app.use(authrouter)
app.use(homerouter) 
app.use(storerouter)
app.use(hostrouter)

app.use(errorcontroller)
mongoose.connect(DBPATH).then(()=>{
    app.listen(3000,()=>{
        console.log("Server running at port http://localhost:3000")
    })
}).catch(err=>{ 
    console.log(err)
})

