const User=require('../models/User');
const Table=require('../models/Tables');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const auth=async (req,res,next)=>
{
    try
    {
    //    const update= await Table.updateMany({},{$set:{b_date:"",date:"",time_slot:""}})
        const token=req.params.token;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        if(!verifyToken)
        {
            req.CurrUser=null;
        }
       
        else{
            const CurrUser=await User.findOne({_id: verifyToken.id});
            req.CurrUser=CurrUser;
        }
    }
    catch(err){
        console.log(err); console.log("token expired");
    req.CurrUser=null;}

    next();
   
}  

module.exports=auth;
