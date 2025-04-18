const { default: mongoose } = require("mongoose")
const home=require("../models/homemodel")
const user=require("../models/usermodel")
const fs=require("fs")
exports.listgetcontroller=(req,res,next)=>{
    res.render("./host/addedithome",{currentPage:"addedithome",edit:false,isloggedin:req.isloggedin,user:req.session.user})
}
exports.listpostcontroller=async (req,res,next)=>{
    
    
    const {"lister-name":listername,"house-name":housename,price,location,rating,description}=req.body
    if(!req.file) res.status(422).redirect("/hosted-homes")
    const image=req.file.path
    const ishomehosted=await home.findOne({housename})
  
    if(ishomehosted) { res.redirect("/hosted-homes")}
    else{
        const hostid=req.session.user._id
        const entry= new home({listername,housename,price,location,rating,image,description,hostid})
        const host=await user.findById(hostid)
        entry.save().then(async (finalhouse)=>{

            host.hosthomes.push(finalhouse._id)
            await host.save()
       
            res.redirect("/hosted-homes")
        })
    }
}
exports.hostedhomescontroller=async (req,res,next)=>{
    const userid=req.session.user._id

    const host=await user.findById(userid).populate("hosthomes").lean()
    const hosthomesinfo=host.hosthomes.map(house=>({...house}))
    for (const hostedhouse of hosthomesinfo) {
        if(!(hostedhouse.isavailable)){
            const buyer=await user.findById(hostedhouse.currentbuyerid)
            hostedhouse.buyername=buyer.firstname+" "+buyer.lastname
            hostedhouse.buyeremail=buyer.email
        }
      }

    console.log(hosthomesinfo) 
    res.render("./host/hostedhomes",{houselist:hosthomesinfo,currentPage:"hostedhomes",isloggedin:req.isloggedin,user:req.session.user})


}

exports.editgetcontroller=(req,res,next)=>{
    console.log(req.params.homeid)
    const editmode=req.query.edit==="true" //changing edit flag(string) to boolean
    const homeid=req.params.homeid
    
    if(mongoose.Types.ObjectId.isValid(homeid)){
        home.findById(homeid).then(homefound=>{
            if(!homefound){
                console.log("Invalid id")
                return res.redirect("/hosted-homes")
            }
            console.log(homefound)
            res.render("./host/addedithome",{home:homefound,edit:editmode,currentPage:"hostedhomes",isloggedin:req.isloggedin,user:req.session.user})
        }).catch(err=>{
            return res.redirect("/hosted-homes")
        })
    }else{
        return res.redirect("/hosted-homes")
    }
}
exports.editpostcontroller=(req,res,next)=>{
    const {"lister-name":listername,"house-name":housename,price,location,rating,id,description}=req.body
 
    home.findById(id).then((home)=>{
        home.listername=listername
        home.housename=housename
        home.price=price
        home.location=location
        home.rating=rating
        if(req.file) {
            fs.unlink(home.image,(err)=>{
                if(err) console.log("Error while deleting file",err)
            })
            home.image=req.file.path
        }
        home.description=description
        home.save().then((result)=>{
            console.log("home updated ",result)
        }).catch((err)=>{
            console.log(err)
        })
        res.redirect("/hosted-homes")
    }).catch(err=>{
        console.log("error while finding home ",err)
    })
 
}


exports.deletepostcontroller=(req,res,next)=>{
    const homeid=req.params.homeid
    console.log(homeid)
    home.findByIdAndDelete(homeid).then(async(deletedhome)=>{
        fs.unlink(deletedhome.image,(err)=>{
            if(err) console.log("Error while deleting file",err)
        })
        const guests=await user.find({usertype:"guest"}) //checking for all guests who may have marked this home as fav and deleting it
        for(let user of guests){
            user.favourites=user.favourites.filter(id=>id!=homeid)
            user.save()
        }
        
        const host=await user.findById(deletedhome.hostid)
        host.hosthomes=host.hosthomes.filter(id=> id!=homeid)
        await host.save()
        res.redirect("/hosted-homes")
    }).catch(error=>{
        console.log(error)
    })


}
