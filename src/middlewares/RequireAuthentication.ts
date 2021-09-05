
import {Request, Response, NextFunction} from "express";




export default function (req: Request, res: Response, next: NextFunction) {

    console.log( "Is authenticated?", ( req as any ).isAuthenticated() );

    if ( ! ( req as any ).isAuthenticated() ) {
        return res.redirect( "/hq/?unauthorized=true" );
    }

    next();
}
