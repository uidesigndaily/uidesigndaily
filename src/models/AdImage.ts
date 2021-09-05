
import { Schema, model } from "mongoose";
import {IAdImage} from "./interfaces/IAdImage";




const AdImageSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    position: {
        type: Number,
        required: true
    },

    img: {
        data: Buffer,
        contentType: String
    }
});


export default model<IAdImage>( "AdImage", AdImageSchema );
