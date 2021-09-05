import { Document } from "mongoose";



export interface IPost extends Document {
    day: number,
    title: string,
    description: string,
    tags: string[],
    date: Date,
    software: string,
    source: string,
    image: string,
    thumbnail: string,
    dominantColor: string,
    colors: string[],
    downloads: number,
    slug: string
}