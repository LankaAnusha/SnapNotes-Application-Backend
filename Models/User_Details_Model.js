const User_Details_Schema=require('../Schemas/User_Details_Schema')
const mongoose=require('mongoose')
const User_Details_Model=mongoose.model("UserDetail",User_Details_Schema)
module.exports=User_Details_Model