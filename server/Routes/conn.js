const mongoose = require('mongoose');

const conn=async ()=>
{
    await mongoose.connect(process.env.url);
    console.log("...Connected to database...");
}


module.exports = conn;