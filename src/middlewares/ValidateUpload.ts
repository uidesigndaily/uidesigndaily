
import {Request, Response, NextFunction} from "express";



export default function (req: Request, res: Response, next: NextFunction) {

    const { day, title, tags, date, software } = req.body;

    console.log( req.body );

    if ( ! day || ! title || ! tags || ! date || ! software ) return res.status( 400 ).json({
        error: "All fields are required for post upload"
    });

    next();
}