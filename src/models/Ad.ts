
import { Schema, model } from "mongoose";
import {IAd} from "./interfaces/IAd";



const AdSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    priority: {
        type: Number,
        default: 100
    },

    clicks: {
        type: Number,
        default: 0
    },

    impressions: {
        type: Number,
        default: 0
    },

    link: {
        type: String,
        required: true
    },

    images: [
        {
            type: Schema.Types.ObjectId,
            ref: "AdImage",
            default: []
        }
    ],

    showOnWebsite: {
        type: Boolean,
        default: true
    },

    showInNewsletter: {
        type: Boolean,
        default: true
    }
});


export default model<IAd>( "Ad", AdSchema );
