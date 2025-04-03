const home=require("../models/homemodel")
const user=require("../models/usermodel")

// exports.indexcontroller=(req,res,next)=>{
//     home.find().then(houselist=>{
//         res.render("./store/index",{houselist:houselist,currentPage:"index"})
//     })
// }

exports.addedhomescontroller=(req,res,next)=>{
    home.find().then(houselist=>{
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