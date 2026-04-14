const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generates JWT token with user id and role inside
const generateToken =(id,role)=>{
    return jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:"7d",});
}

//1.register a new user, for route -> PPOST /api/auth/register access-> public.

const registerUser = async (req , res)=>{
    try{
            const {name,email,password,role,phone}= req.body;
            const userExists= await User.findOne({email});
            if(userExists){
                return res.status(400).json({message: "User already exists..."});
            }

            //user not present so we create new user and password is automatically hashed by our schema

            const user= await User.create({
              name,
              email,
              password,
              role,
              phone, 
            });

            //sending back info + token
            if(user){
                res.status(201).json({
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    token:generateToken(user._id,user.role),
                })
            }
    }
    catch(err){
        console.log("Full Error:", err);
        res.status(500).json({message:err.message});
    }
};

//2. login user, route-> POST /api/auth/login , access -> public

const loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body;

        const user= await User.findOne({email});

        //check if  user exists and password matches
        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id,user.role),
            })
        }
        else{
            res.status(401).json({message:"Invalid email or password"});
            } 
    } 
    catch(err){
            res.status(500).json({message:err.message});
    } 
}

//3. logged into user profile, route-> GET /api/auth/me access -> private

const getMe= async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports={registerUser, loginUser, getMe};
        
        
    

