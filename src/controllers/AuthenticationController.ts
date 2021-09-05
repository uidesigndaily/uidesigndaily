
import { Router, Request, Response, NextFunction } from "express";
import { Strategy } from "passport-local";
import * as passport from "passport";


import User from "../models/User";
import SubscriptionController from "./SubscriptionController";





class AuthenticationController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public initialize() {
        passport.use( "local-login", this.getLoginStrategy() );

        SubscriptionController.registerStrategies( passport );

        passport.serializeUser( (user: any, done) => {
            done( null, user._id );
        });

        passport.deserializeUser( (id, done) => {
            User.findById( id )
                .then( (res: any) => done( null, res as any ) )
                .catch( (err: Error) => done( err, false ) );
        });

        return passport.initialize();
    }



    public routes() {
        this.router.post( "/login", this.login );
    }



    public login(req: Request, res: Response, next: NextFunction) {

        passport.authenticate( "local-login", (err, user, info) => {
            if ( info )     return res.send( info.message );
            if ( err )      return next( err );
            if ( ! user )   return res.redirect( "/hq" );

            ( req as any ).login(user, (err: any) => {
                if ( err ) return next( err );


                return res.redirect( "/admin-dashboard" );
            });
        })( req, res, next );
    }



    private getLoginStrategy(): Strategy {
        return new Strategy(
            {
                usernameField: "email",
                passReqToCallback : true
            },
            ( req, email, password, done ) => {

                User.findOne( { email } )
                    .then(  async user => {

                        if ( ! user ) {
                            return done( null, false, { message: "Invalid Credentials.\n" } );
                        }

                        const passwordsMatch = await user.comparePassword( password );

                        if ( ! passwordsMatch ) {
                            return done( null, false, { message: "Invalid Credentials.\n" } );
                        }


                        if ( req.session ) {
                            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                        }


                        return done( null, user );
                    })
                    .catch( (err: Error) => done( err ) );
            }
        );
    }


}


export default new AuthenticationController();
