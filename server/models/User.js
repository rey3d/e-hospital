const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:['patient','doctor','admin'],
            default:'patient',
        },
        phone:{
            type:String,
        },
        profilePic:{
            type:String,
            default:"",
        },
    },
    {timestamps:true}
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports=mongoose.model("User",userSchema);