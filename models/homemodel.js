// const path=require("path")
// const fs=require("fs")
// const homedbpath=path.join(__dirname,"../database","/homes.json")
// const {getdb}=require("../utils/dbutil")

const { default: mongoose } = require("mongoose");

const homeschema=new mongoose.Schema({
    listername:{type:String,required:true},
    housename:{type:String,required:true},
    price:{type:Number,required:true},
    rating:{type:Number,required:true},
    location:{type:String,required:true},
    image:{type:String},
    description:{type:String},
    hostid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    isavailable:{type:Boolean,default:true},
    currentbuyerid:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
})

// homeschema.pre("findOneAndDelete",async function(next){
//     const houseid=this.getQuery()._id
//     await favourites.findOneAndDelete({houseid})
//     next()
// })  

module.exports=mongoose.model("home",homeschema)



























// const {ObjectId}=require("mongodb")
// module.exports= class home{
//     constructor(listername,housename,price,location,rating,image,description,_id){
//         this.listername=listername
//         this.housename=housename
//         this.price=price
//         this.location=location
//         this.rating=rating
//         this.image=image
//         this.description=description
//         if(_id)this._id=_id
//     }
//     save(){
//         const db=getdb()
//         if(this._id){
//             const updatedobj={
//                 listername :this.listername,
//                 housename:this.housename,
//                 price :this.price,
//                 location:this.location,
//                 rating:this.rating,
//                 image:this.image,
//                 description:this.description  
//             }
//             return db.collection('homes').updateOne({_id:new ObjectId(String(this._id))},{$set:updatedobj})
//         }
//         else{
//             return db.collection('homes').insertOne(this)
//         }
//     }

//     static find(){
//         const db=getdb()
//         return db.collection('homes').find().toArray()
//     }
    
//     static findbyID(homeid){
//         const db=getdb()
//         return db.collection('homes').find({_id:new ObjectId(String(homeid))}).next()//The part preceeding next returns a cursor to the object and .next() will return that object
//     }

//     static delete(homeid){
//         const db=getdb()
//         return db.collection('homes').deleteOne({_id:new ObjectId(String(homeid))})
//     }
// }