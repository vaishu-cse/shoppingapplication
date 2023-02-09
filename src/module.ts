import {Application} from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import {json,urlencoded} from 'body-parser'
import cors from 'cors'
import cookieSession from 'cookie-session'
import mongoose from 'mongoose'
import {currentUser, errorHandler} from '@shoppingapplication/common'
import { authRouters } from './auth/auth.routers'
import { sellerRouters } from './seller/seller.routers'


export class AppModule{
    constructor(public app:Application){
        app.set("trust-proxy",true)

        app.use(cors({
            origin:"*",
            credentials:true,
            optionsSuccessStatus:200
        }))

        app.use(urlencoded({extended:false}))
        app.use(json())
        app.use(cookieSession({
            signed:false,
            secure:false
        }))
        

        Object.setPrototypeOf(this,AppModule.prototype)
    }

    async start(){
        if(!process.env.MONGO_URI){
            throw new Error('mongo_uri must be definrd')
        }

        if(!process.env.JWT_KEY){
            throw new Error('JWT_KEY must be defined')
        }

        try{
            await mongoose.connect(process.env.MONGO_URI)
        }catch(err){
            throw new Error('database connection error')
        }

        this.app.use(currentUser(process.env.JWT_KEY!));
        this.app.use(authRouters);
        this.app.use(sellerRouters);
        this.app.use(errorHandler);

        this.app.listen(8080,()=>console.log('server is listening on port 8080'))
    }
}