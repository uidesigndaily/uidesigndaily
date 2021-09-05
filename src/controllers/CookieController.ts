

import {Router, Request, Response, NextFunction} from "express";




class CookieController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/dismiss", this.dismiss );


    }



    public dismiss(req: Request, res: Response, next: NextFunction) {
        res.cookie(
            "cookie_dismissed",
            true,
            {
                domain: process.env.NODE_ENV === "production" ? "uidesigndaily.com" : "localhost",
                // Cookie expires in 1 year
                expires: new Date( Date.now() + 60 * 60 * 1000 * 24 * 365 ),
                sameSite: true

            });
        res.end();
    }
    
}


export default new CookieController().router;
