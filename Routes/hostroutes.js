const express=require("express")
const hostrouter=express.Router()
const {listgetcontroller} =require("../controllers/hostcontroller")
const {listpostcontroller} =require("../controllers/hostcontroller")
const {hostedhomescontroller} = require("../controllers/hostcontroller")
const {editgetcontroller}= require("../controllers/hostcontroller")
const {editpostcontroller}= require("../controllers/hostcontroller")
const {deletepostcontroller}=require("../controllers/hostcontroller")

hostrouter.get("/addhome",listgetcontroller)
hostrouter.post("/addhome",listpostcontroller)
hostrouter.get("/hosted-homes",hostedhomescontroller)
hostrouter.get("/edithome/:homeid",editgetcontroller)
hostrouter.post("/edithome",editpostcontroller)
hostrouter.post("/deletehome/:homeid",deletepostcontroller) 

module.exports=hostrouter 
