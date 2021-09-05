import { Document } from "mongoose";





export interface IUser extends Document {

    firstName: string,
    lastName: string,

    email: string,

    password: string
    resetPasswordToken: string,
    resetPasswordExpires: Date,

    isConfirmed: boolean,

    isAdmin: boolean

    comparePassword(password: string): Promise<boolean>
}
