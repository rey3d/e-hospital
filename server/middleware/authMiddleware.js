const jwt= require("jsonwebtoken");
const User= require("../models/User");

//check if token is valid

const protect = async (req , res , next)=>{
    let token;

    //check if token exists in request header 
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            // Extract token from "Bearer <token>"
            token=req.headers.authorization.split(" ")[1];

            // verify token is valid and not expired

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // attach usr info to request object

            req.user = await User.findById(decoded.id).select("-password");
            
            next();
        }
        catch(err){
            res.status(401).json({message:"Not authorized, token failed"});
        }
    }
    if(!token){
        res.status(401).json({message:"Not authorized, no token"});
    }
}

// Role check ,sage: authorizeRoles("admin") or authorizeRoles("admin", "doctor")

const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: `Role '${req.user.role}' is not allowed to access this route`,
            });
        }
        next();
    };
};

module.exports={protect, authorizeRoles};