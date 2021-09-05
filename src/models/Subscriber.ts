
import { Schema, model } from "mongoose";
import {ISubscriber} from "./interfaces/ISubscriber";



const SubscriberSchema = new Schema({
    firstName: String,

    lastName: String,

    email: {
        type: String,
        unique: true
    }
});


export default model<ISubscriber>( "Subscriber", SubscriberSchema );