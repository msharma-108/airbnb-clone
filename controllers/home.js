const home=require("../models/homemodel")
// exports.homecontroller=(req,res,next)=>{
//     res.render("home",{currentPage:""})
// }
exports.gethome=(req,res,next)=>{
    home.find().then(houselist=>{

        res.render("./home",{houselist:houselist,currentPage:"home",isloggedin:req.isloggedin,user:req.session.user})
    })
}