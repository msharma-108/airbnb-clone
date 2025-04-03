const express=require("express")
const authrouter=express.Router()

const authcontroller=require ("../controllers/authcontroller")

authrouter.get("/login",authcontroller.getlogin)
authrouter.post('/login',authcontroller.postlogin)
authrouter.post("/logout",authcontroller.logout)
authrouter.get("/signup",authcontroller.getsignup)
authrouter.post('/signup',authcontroller.postsignup)

module.exports=authrouter