const express=require('express');
const Router=express.Router();
const {Register,Login,Reserve,Create,getTables,admRegd,admLogin,getallres,action,getuserRes}=require('../controller/controller');
const auth=require('../auth/auth');

Router.post('/user/register',Register);
Router.post('/admin/register',admRegd);

Router.post('/user/login',Login);
Router.post('/admin/login',admLogin);

Router.get('/api/getUser/:token', auth, (req,res)=>
{
    if(req.CurrUser===null)
    {
        return res.status(400).send({error:"Please sign in first to view this page"});
    }
    else
    return res.status(200).send(req.CurrUser);
})

Router.post('/api/add', Create)
module.exports=Router;

Router.post('/api/reserve/:token', auth, Reserve);

Router.post('/api/tables/:token', auth ,getTables);


Router.get('/api/allreservations', getallres);

Router.post('/api/action', action)

Router.get('/api/user/getres/:token', auth , getuserRes)
