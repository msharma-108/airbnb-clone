const express=require("express")
const homerouter=express.Router()
const homecontroller =require("../controllers/home")
homerouter.get("/",homecontroller.gethome)
module.exports=homerouter
