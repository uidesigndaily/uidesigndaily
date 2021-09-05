
import { Document } from "mongoose";



export interface IGlobals extends Document {
    tags: string[],
    software: string[]
}