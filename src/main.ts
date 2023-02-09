import {AppModule} from './module'
import  express from 'express'
import { JwtPayload } from '@shoppingapplication/common'

declare global{
    namespace Express{
        interface Request{
            currentUser?:JwtPayload
            uploaderError?:Error
        }
    }
}

const bootstrap=()=>{
    const app=new AppModule(express()) //call express inside the app module class so that we have an access to the start function inside the appmodule class//

    app.start()//calling the start function inside appmodule class//
}

bootstrap()