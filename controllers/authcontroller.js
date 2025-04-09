const { check, validationResult } = require("express-validator")
const bcrypt=require("bcryptjs")
const user = require("../models/usermodel")

exports.getlogin=(req,res,next)=>{

    res.render("auth/login",{currentPage:"login",isloggedin:false,errormessages:[],user:{}})
}

exports.postlogin=async (req,res,next)=>{
    // console.log(req.body)
    // req.isloggedin=true;
    // res.cookie("isloggedin",true)
    console.log(req.session)
    if(req.session.isloggedin==true){
      await req.session.destroy()
    }
  
    const {email,password}=req.body
    const finduser=await user.findOne({email})
    if(!finduser){
      
      return res.status(422).render("auth/login",{
            currentPage:"login",
            isloggedin:false,
            errormessages:["Invalid email or password"],
            user:{}
        })
    }
    const ismatch=await bcrypt.compare(password,finduser.password)
    if(!ismatch){
      return res.status(422).render("auth/login",{
        currentPage:"login",
        isloggedin:false,
        errormessages:["Invalid email or password"],
        user:{}
      })
    }

    req.session.isloggedin=true
    req.session.user=finduser
    await req.session.save()
    if (finduser.usertype=="guest")res.redirect("/added-homes")
   else res.redirect("/hosted-homes")

}

exports.logout=(req,res,next)=>{
    // res.cookie("isloggedin",false)

    req.session.destroy(()=>{
        res.redirect("/login")
    })  
}

exports.getsignup=(req,res,next)=>{
    res.render("auth/signup",{currentPage:"signup",isloggedin:false,errormessages:[],
        oldinput: {firstname: "", lastname: "", email: "", usertype: ""}
        ,user:{} 
    })
}

exports.postsignup=[
    check("firstname")
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("lastname")
  .matches(/^[A-Za-z\s]*$/)
  .withMessage("Last Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min: 8})
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@&]/)
  .withMessage("Password should contain atleast one special character")
  .trim(),

  check("confirmpassword")
  .trim()
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("usertype")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host'])
  .withMessage("Invalid user type"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept the terms and conditions")
  .custom((value, {req}) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

   (req,res,next)=>{

    const {firstname,lastname,password,usertype,email}=req.body
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.render("auth/signup",{
            currentPage:"signup",
            isloggedin:false,
            errormessages:errors.array().map(error=>error.msg),
            oldinput:{
                firstname,
                lastname,
                email,
                usertype
            },
            user:{}
        })
    }else{
        bcrypt.hash(password,10).then(async (hashedpassword)=>{
            const existinguser= await user.findOne({email})
            if(existinguser){
              throw new Error("This email is already in use")
            }
            else {
              const newuser= new user({firstname:firstname,lastname:lastname,email:email,password:hashedpassword,usertype:usertype})
              return newuser.save()
            }
        }).then(()=>{
 
          res.redirect("/login")
        }).catch(err=>{
            return res.render("auth/signup",{
              currentPage:"signup",
              isloggedin:false,
              errormessages:[err.message],
              oldinput:{
                  firstname,
                  lastname,
                  email,
                  usertype
              },
              user:{}
          })
        })

    }
  }
]




