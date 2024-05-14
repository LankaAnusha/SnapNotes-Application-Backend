const {Schema}=require('mongoose')
const User_Details_Schema= new Schema({
    UserId:{type:String,required:true},
    username:{type:String,required:true},
    email:{type:String,required:true,index:true},
    password:{type:String,required:true}
})
module.exports=User_Details_Schema