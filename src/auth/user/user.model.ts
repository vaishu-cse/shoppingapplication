import mongoose, { Schema } from 'mongoose'
import {UserModel, UserDoc,AuthenticationService} from '@shoppingapplication/common'
const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{ //another configuration//
    toJSON:{
        transform(doc,ret){ //to delete the id and password to the user//
            ret.id=ret._id,
            delete ret._id,
            delete ret.password
        }
    }
})

schema.pre('save',async function(done) { //pre-method before saving//save - an event//2nd parameter-a function//
    const authenticationService = new AuthenticationService()
    if(this.isModified('password') || this.isNew){
       const hashedPwd = authenticationService.pwdToHash(this.get('password'));
       this.set('password',hashedPwd)
    }
    done()
})


export const User=mongoose.model<UserDoc, UserModel>('User',schema)