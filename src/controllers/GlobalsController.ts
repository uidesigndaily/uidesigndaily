

import {Router, Request, Response, NextFunction} from "express";
import Globals from "../models/Globals";




class GlobalsController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/tags", this.getTags );
        this.router.get( "/software", this.getSoftware );
    }



    public getTags(req: Request, res: Response, next: NextFunction) {

        Globals.findOne()
            .then( globals => {
                if ( ! globals ) return res.status( 404 ).json({
                    error: "Globals not found."
                });

                res.status( 200 ).json( globals.tags )
            })
            .catch( next );
    }



    public getSoftware(req: Request, res: Response, next: NextFunction) {

        Globals.findOne()
            .then( globals => {
                if ( ! globals ) return res.status( 404 ).json({
                    error: "Globals not found."
                });

                res.status( 200 ).json( globals.software )
            })
            .catch( next );
    }




}


export default new GlobalsController().router;
