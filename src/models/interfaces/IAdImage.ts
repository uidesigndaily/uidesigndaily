
import {AdImagePosition} from "../constants/AdImagePosition";
import { Document } from "mongoose";



export interface IAdImage extends Document {
    name: string,
    position: AdImagePosition,
    img: any
}
