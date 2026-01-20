
const adminAuth =(req , res , next)=>{
    const user = req.user;
    if(!user || !user.role!=="Admin"){
        return res.status(403).json({message : "Forbidden admins only"});
    }

    next();
}
module.exports = adminAuth;
