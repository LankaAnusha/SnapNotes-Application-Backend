const {Schema}=require('mongoose')
const TrashNotesSchema=new Schema({
    UserId:{type:String,required:true,index:true},
    NoteId:{type:String,index:true,unique:true,required:true},
    title:{type:String,required:true},
    image:String,
    content:{type:String,required:true},
    date:String,
    fav:Boolean
})
module.exports=TrashNotesSchema