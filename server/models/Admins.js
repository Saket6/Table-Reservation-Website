const mongoose =require('mongoose');

const AdminSchema=new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
    },
    email: {
        type: 'String',
        required: true,
    },
    password:{
        type: 'String',
        required: true,
    },
    c_password:{
        type: 'String',
        required: true,
    },
    phone:{
        type:Number,
        required: true,
    },
    DOB:{
        type: Date,
        required: true,
    },
    gender:{
        type: 'String',
        required: true,
    }
   
})

const Admins=mongoose.model('Admins',AdminSchema);

module.exports = Admins;   

