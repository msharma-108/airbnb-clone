const { default: mongoose } = require( "mongoose");

const userschema= new mongoose.Schema({
    firstname:{type:String,required:[true,"First name is required"]},
    lastname:String,
    email:{type:String,required:[true,"Email is required"],unique:true},
    password:{type:String,required:[true,"Password name is required"]},
    usertype:{type:String,enum:["guest","host"],default:"guest"},      
    favourites: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "home" }], default: undefined},
    hosthomes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "home" }], default: undefined }
})

userschema.pre('save', function (next) {
    if (this.usertype === 'guest') {
      // If the user is a guest, ensure favourites field is defined
      if (!this.favourites) {
        this.favourites = []; // Default empty array if not defined
      }
    } else if (this.usertype === 'host') {
      // If the user is a host, ensure hosthomes field is defined
      if (!this.hosthomes) {
        this.hosthomes = []; // Default empty array if not defined
      }
    }
  
    next();
  });

module.exports=new mongoose.model("user",userschema)