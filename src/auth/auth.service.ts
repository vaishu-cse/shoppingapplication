import { AuthDto } from "./dtos/auth.dtos";
import { UserService, userService } from "./user/user.service";
import {NextFunction} from 'express'
import {AuthenticationService, BadRequestError} from '@shoppingapplication/common'

export class AuthService{
    constructor(
        public userService:UserService,
        public authenticationService:AuthenticationService
    ){}

    async signup(createUserDto:AuthDto, errCallback:NextFunction){
        const existingUser = await this.userService.findOneByEmail(createUserDto.email)
        if(existingUser) return errCallback(new BadRequestError('this email is taken'));

        const newUser = await this.userService.create(createUserDto);

        const jwt = this.authenticationService.generateJwt({email:createUserDto.email, userId:newUser.id}, process.env.JWT_KEY!)
        return jwt;

    }

    async signin(signinDto:AuthDto, errCallback:NextFunction){
        const user = await this.userService.findOneByEmail(signinDto.email);
        if(!user) return errCallback(new BadRequestError("Please signup first!"));

        const samePwd = this.authenticationService.pwdCompare(user.password,signinDto.password)
        if(!samePwd) return errCallback(new BadRequestError("enter correct password"))

        const jwt=this.authenticationService.generateJwt({email:signinDto.email, userId:user.id},process.env.JWT_KEY!)
        return jwt
    }
}

export const authService = new AuthService(userService,new AuthenticationService())