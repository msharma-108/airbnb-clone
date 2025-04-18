const home=require("../models/homemodel")
const user=require("../models/usermodel")
const payment=require("../models/paymentmodel")
const crypto=require("crypto")
const {instance}=require("../config/razorpayInstance.js")

// exports.indexcontroller=(req,res,next)=>{
//     home.find().then(houselist=>{
//         res.render("./store/index",{houselist:houselist,currentPage:"index"})
//     })
// }

exports.addedhomescontroller=(req,res,next)=>{
    home.find({isavailable:true}).then(houselist=>{
        res.render("./store/addedhomes",{houselist:houselist,currentPage:"addedhomes",isloggedin:req.isloggedin,user:req.session.user})
    })
}

exports.bookingscontroller=(req,res,next)=>{
        res.render("./store/mybookings",{currentPage:"mybookings",isloggedin:req.isloggedin,user:req.session.user})
    } 
 
exports.getfavouritescontroller=async(req,res,next)=>{
    
        const userid=req.session.user._id
        const finduser=await user.findById(userid).populate("favourites")
        // console.log(finduser)
        // console.log(req.session.user)
        res.render("./store/favourites",{
            currentPage:"favourites",
            favhomes:finduser.favourites,
            isloggedin:req.isloggedin,
            user:req.session.user 
        })


        // favourites.find().populate("houseid").then(favourites=>{
        //     const favwithdetails=favourites.map(fav=>fav.houseid)
        //     res.render("./store/favourites",{currentPage:"favourites",favhomes:favwithdetails,isloggedin:req.isloggedin,user:req.session.user})
        // })

        //Slow method:-
        // home.find().then(houselist=>{
        //     favourites.find().then(favouriteslist=>{
        //         favouriteslist=favouriteslist.map(home=>home.houseid.toString())
        //         const favwithdetails=houselist.filter(home=>favouriteslist.includes(home._id.toString()))
        //         res.render("./store/favourites",{currentPage:"favourites",favhomes:favwithdetails})
        //     })
        // })
    }


exports.postfavouritescontroller=async (req,res,next)=>{
    const houseid=req.body.id
    const userid=req.session.user._id
    const finduser=await user.findById(userid)
    if(!finduser.favourites.includes(houseid)){
        finduser.favourites.push(houseid)
        await finduser.save()
    }
    return res.redirect("/favourites")
    // favourites.findOne({houseid}).then((existingfav)=>{
    //     if(existingfav) {
    //         console.log("Already marked favourite")
    //         return Promise.resolve()
    //     }
    //     const newfav= new favourites({houseid})
    //     return newfav.save()
    // }).then( ()=> {
    //     return res.redirect("/favourites")
    // })
    // .catch(err=>{
    //     console.log("Error while adding fav ",err)
    // })
}

exports.deletefavouritecontroller=async (req,res,next)=>{
    const houseid=req.params.homeid
    const userid=req.session.user._id
    console.log(houseid)
    const finduser=await user.findById(userid)
    if(finduser.favourites.includes(houseid)){
        finduser.favourites=finduser.favourites.filter(id=> id!=houseid)
        console.log(finduser.favourites)
        await finduser.save()
    }
    res.redirect("/favourites")
    // favourites.findOneAndDelete({houseid}).then(()=>{console.log("Home deleted from favs")})
    // .catch(err=>console.log("Error:",err))
    // .finally(res.redirect("/favourites"))
}

exports.detailscontroller=(req,res,next)=>{
    const homeid=req.params.homeid
    home.findById(homeid).then(homefound=>{
        if(!homefound){
            console.log("not found")
            res.redirect("/added-homes")
        }
        else{
            console.log(homefound)
            res.render("./store/homedetail",{currentPage:"addedhomes",home:homefound,isloggedin:req.isloggedin,user:req.session.user})           
        }
    })
}



 
exports.checkout=async (req,res,next)=>{
    try {
        const {amount,payeeid,houseid}=req.body
        const orderoptions = {
            amount:amount*100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR", 
          };
        const order= await instance.orders.create(orderoptions)
        order.api_key=process.env.RAZORPAY_KEYID
        req.session.payment={}
        req.session.payment.orderid=order.id
        req.session.payment.payeeid=payeeid
        req.session.payment.houseid=houseid
        return res.json(order)
    } catch (error) {
        console.log("payment error ",error)  
    }
}

exports.paymentverification=async (req,res,next)=>{
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body
    const body=  req.session.payment.orderid + "|" + razorpay_payment_id
    
    const expected_signature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex")
    console.log(expected_signature)
    console.log(razorpay_signature)
    
    if(expected_signature===razorpay_signature){
        
        console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature,req.session.payment.payeeid,req.session.user._id)
        const newpayment= new payment({
            razorpay_payment_id,razorpay_order_id,razorpay_signature,payee_id:req.session.payment.payeeid,payer_id:req.session.user._id
        })
        newpayment.save()
        const rentedhouse=await home.findById(req.session.payment.houseid)
        rentedhouse.isavailable=false;
        rentedhouse.currentbuyerid=req.session.user._id
        rentedhouse.save()
        delete req.session.payment
        res.render("./store/paymentok",{razorpay_payment_id})
      
    }
    else res.send("payment unsuccessful") 
}

