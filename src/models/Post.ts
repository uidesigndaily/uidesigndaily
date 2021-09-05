
import { Schema, model } from "mongoose";
import {IPost} from "./interfaces/IPost";



const PostSchema = new Schema({
    day: {
        type: Number,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    description: String,

    tags: {
        type: [ String ],
        default: [],
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    software: {
        type: String,
        required: true
    },

    source: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    dominantColor: {
        type: String,
        required: true
    },

    colors: {
        type: [ String ],
        required: true
    },

    downloads: {
        type: Number,
        default: 0
    },

    slug: {
        type: String,
        required: true,
        unique: true
    }

});


export default model<IPost>( "Post", PostSchema );