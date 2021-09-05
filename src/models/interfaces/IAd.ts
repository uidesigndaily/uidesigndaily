
import { Document, Schema } from "mongoose";



export interface IAd extends Document {
    name: string,
    title: string,
    description: string,
    priority: number,
    clicks: number,
    impressions: number,
    link: string,
    images: Schema.Types.ObjectId[]
}
