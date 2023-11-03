
const User=require('../models/User');
const Table=require('../models/Tables');
const Admin=require('../models/Admins');
const Reservation=require('../models/Reservations');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const SECRET_KEY=process.env.SECRET_KEY;
const Register=async (req,res)=>
{
    const {name,email,password,c_password,phone,DOB,gender}=req.body;
    if(email===" " || password==="" || c_password==="" || name===""|| phone==="" || gender===""|| DOB==="")
        return res.status(400).json({error: 'Please fill all fields'});
    try{
        
        const exist_user=await User.findOne({email:email});
        if(exist_user)
        {
           return res.status(400).json({"error":"User already exists.Please sign in"});
        }
        else
        {
            if(password!==c_password)
            {
              return res.status(400).json({"error":"Password must be same as confirm password"});
            }
            else{
                const enc_pass=await bcrypt.hash(password,10);
                const enc_c_pass=await bcrypt.hash(c_password,10);
                const newuser=new User({name,email,password: enc_pass,c_password:enc_c_pass,phone,DOB,gender});
                const resp=await newuser.save();
                return res.status(200).json({message:"Registration successful"});
            }
        }
    }
    catch(err){console.log(err);}
   
}


const Login=async (req,res)=>
{
    const {email,password} = req.body;
    const exist_user=await User.findOne({email:email});
    if(!exist_user)
        return res.status(400).json({error: 'Not registered yet'});
    else{
        const validPassword = await bcrypt.compare(password,exist_user.password);
        if(!validPassword)
        {
            return res.status(400).json({error: 'Invalid login credentials'});
        }
        else{
            const tokendata={
                id: exist_user._id,
                date: Date.now(),
            }
            const token=jwt.sign(tokendata,SECRET_KEY);

            return res.status(200).json({message: "Signed in successfully",token:token,type: "customer"});
        }
    }
}

const Reserve=async (req,res)=>
{
    try{
        const {date,time_slot,party_size,name,email,table_no}=req.body;
        if(email!==req.CurrUser.email)
        {
            return res.status(403).json({error:"Your email doesnot match with the provided email"});
        }
        else
        {
            const exist_res=await Reservation.findOne({date,time_slot,T_id:table_no});
            if(exist_res)
            {
                return res.status(403).json({error:"Table already reserved"});
            }
            else{
                const newRes=new Reservation({email,date,time_slot,party_size,name,T_id:table_no});
                newRes.save();
                const update=await Table.updateOne({T_id:table_no},{$set:{status: "Pending",b_date: new Date(Date.now()),date,time_slot}})
                return res.status(200).json({message: "Booking successful."});
            }
        }
    }catch(e){console.log(e);}
   
}

const Create=(req,res)=>
{
    const newTable=new Table(req.body);
    newTable.save();
    console.log("table added to DB");
}


const getTables=async (req,res)=>
{
//    console.log(req.body);
   const {date,time_slot,party_size}=req.body;
    console.log(date,time_slot,party_size);
   try{
    const tables = await Table.find({
        capacity: {$gte:party_size},
        $or: [
           {
              $and: [
                 { date: { $ne: date } }, // Date does not match
                 { time_slot: { $ne: time_slot } } // Time slot does not match
              ]
           },
           {
              date: { $ne: date }, // Date does not match
           },
           {
              time_slot: { $ne: time_slot } // Time slot does not match
           }
        ]
     });
    //  console.log(tables);
    res.status(200).send(tables);
   }
   catch(e){console.log(e);}
}

const admRegd=async (req,res)=>
{
    const {admin_id,name,email,password,c_password,phone,gender,DOB}=req.body;
    if(admin_id==="" || email===" " || password==="" || c_password==="" || name==""|| phone==="" || gender==="" || DOB=="")
            return res.status(400).json({error: 'Please fill all fields'});
    if(admin_id!=process.env.admin_id)
    {
        return res.status(400).json({error: 'Invalid admin'});
    }else
    {
        
        if(password!=c_password)
             return res.status(400).json({error: 'Password must be same as confirm password'});
        const exist_email=await Admin.findOne({email});
        if(exist_email)
        {
            return res.status(400).json({error: 'Admin already exists.Please sign in'});
        }
        else
        {
            const enc_pass=await bcrypt.hash(password,10);
            const enc_c_pass=await bcrypt.hash(c_password,10);
            const newAdmin=new Admin({name,email,password:enc_pass,c_password:enc_c_pass,DOB,gender,phone});
            await newAdmin.save();
            console.log("New admin created");
            return res.status(200).json({message: "Registered successfully"});

        }
    }

   
}
const admLogin = async (req,res)=>
{
    const {email,password} = req.body;
    const exist_user=await Admin.findOne({email:email});
    if(!exist_user)
        return res.status(400).json({error: 'Invalid admin'});
    else{
        const validPassword = await bcrypt.compare(password,exist_user.password);
        if(!validPassword)
        {
            return res.status(400).json({error: 'Invalid login credentials'});
        }
        else{
            const tokendata={
                id: exist_user._id,
                type: "Admin",
                date: Date.now(),
            }
            const token=jwt.sign(tokendata,SECRET_KEY);

            return res.status(200).json({message: "Signed in successfully",token:token,type: "admin"});
        }
    }
}



const getallres=async (req,res)=>
{
    try{
        const allres=await Reservation.find();
        res.status(200).send(allres);
    }
    catch(e){console.log(e); console.log("could not get all reservations")}
   

}


const action=async (req,res)=>
{
    try
    {
        const {email,name,b_date,date,time_slot,party_size,T_id,status}=req.body.item;
    const action=req.body.action;
    const update_res=await Reservation.updateOne(req.body.item,{$set:{status: action}});
    return res.status(200).json({message: "updated"});
    }
    catch (err) {console.log(err);
    return res.status(400).json({error:"Couldn't update"});
    }
    
}

const getuserRes=async (req,res)=>
{
    try{
        const userres=await Reservation.find({email:req.CurrUser.email});
        // console.log(userres);
        return res.status(200).send(userres);
    }
    catch(e){console.log(e);
    return res.status(400).json({error:"Couldnt get reservations for user"});
    }
}

module.exports = {Register,Login,Reserve,Create,getTables,admRegd,admLogin,getallres,action,getuserRes};