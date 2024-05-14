const {Schema}=require('mongoose')
const FavNotesSchema= new Schema({
    UserId:{type:String,required:true,index: true},
    NoteId:{type:String,required:true,unique:true,index:true},
    title:{type:String,required:true},
    image:String,
    content:{type:String,required:true},
    date:String,
    fav:{type:Boolean}
})
module.exports=FavNotesSchema