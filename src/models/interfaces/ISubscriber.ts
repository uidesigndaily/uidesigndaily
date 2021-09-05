import { Document } from "mongoose";



export interface ISubscriber extends Document {
    firstName: string,
    lastName: string,
    email: string
}