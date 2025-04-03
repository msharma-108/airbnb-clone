const errorcontroller=("*",(req,res,next)=>{
    res.status(404).render("error",{currentPage:"",isloggedin:req.isloggedin,user:req.session.user})
})
module.exports=errorcontroller