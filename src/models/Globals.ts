
import { Schema, model } from "mongoose";
import {IGlobals} from "./interfaces/IGlobals";




const GlobalsSchema = new Schema({

    tags: {
        type: [ String ],
        default: []
    },

    software: {
        type: [ String ],
        default: []
    }

});


export default model<IGlobals>( "Globals", GlobalsSchema );