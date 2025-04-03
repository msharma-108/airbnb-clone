const express=require("express")
const storerouter=express.Router()
const storecontroller =require("../controllers/storecontroller")

// const {houselist}=require("./listhomes")
storerouter.get("/added-homes",storecontroller.addedhomescontroller)
storerouter.get("/mybookings",storecontroller.bookingscontroller)
// storerouter.get("/index",storecontroller.indexcontroller)
storerouter.get("/favourites",storecontroller.getfavouritescontroller)
storerouter.post("/favourites",storecontroller.postfavouritescontroller)
storerouter.get("/added-homes/:homeid",storecontroller.detailscontroller)
storerouter.post("/favourites/deletehome/:homeid",storecontroller.deletefavouritecontroller)

module.exports=storerouter  