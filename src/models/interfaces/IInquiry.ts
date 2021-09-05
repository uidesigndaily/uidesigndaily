import { Document } from "mongoose";



export interface IInquiry extends Document {
    name: string,
    email: string,
    subject: string,
    message: string
}