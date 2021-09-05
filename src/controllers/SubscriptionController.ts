
import { Router, Request, Response, NextFunction } from "express";

import {ValidationHelper} from "../helpers/ValidationHelper";
import * as mg from "nodemailer-mailgun-transport";
import Subscriber from "../models/Subscriber";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as crypto from "crypto";
import * as fs from "fs-extra";
import * as path from "path";
import axios from "axios";

const handlebars = require( "handlebars" );

const subscribedEmailTemplate = fs.readFileSync( path.join( __dirname, "../../templates/subscribed.hbs" ), "utf8" );


const GoogleStrategy    = require("passport-google-oauth20").Strategy;
const FacebookStrategy  = require("passport-facebook").Strategy;
const TwitterStrategy   = require("passport-twitter").Strategy;


class SubscriptionController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();

        this.OAuthCallback  = this.OAuthCallback.bind( this );
    }



    public registerStrategies(passport: passport.PassportStatic) {
        passport.use( "google", this.getGoogleStrategy() );
        passport.use( "facebook", this.getFacebookStrategy() );
        passport.use( "twitter", this.getTwitterStrategy() );
    }



    public routes() {
        this.router.post( "/subscribe", this.subscribe );
        this.router.get( "/unsubscribe/:id", this.unsubscribe );

        this.router.get( "/oauth/google", this.googleAuth );
        this.router.get( "/google/callback", passport.authenticate("google", { failureRedirect: '/' }), this.OAuthCallback );

        this.router.get( "/oauth/twitter", this.twitterAuth );
        this.router.get( "/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/" } ), this.OAuthCallback );

        this.router.get( "/oauth/facebook", this.facebookAuth );
        this.router.get( "/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" } ), this.OAuthCallback );

        this.router.post( "/slack-invite", this.inviteToSlack );
    }



    public inviteToSlack = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        if ( ! ValidationHelper.validateEmail( email ) ) {
            res.json( { success: false, message: "Invalid invite data. Please provide a valid email address to subscribe." } );
            return;
        }


        const QUERY_PARAMS = `email=${ email }&token=${ process.env.SLACK_TOKEN }&set_active=true`;

        axios.post(
            `https://myteam.slack.com/api/users.admin.invite?${ QUERY_PARAMS }`
        )
            .then( (response: any) => {

                console.log( response.data );

                if ( response.data.ok ) {
                    res.status( 200 ).json( { message: "User invited." } );
                } else {
                    res.status( 400 ).json( response.data )
                }
            })
            .catch( next )


    };



    public googleAuth(req: Request, res: Response, next: NextFunction) {

        if ( req.headers.referer ) (req as any).session.auth_ref = req.headers.referer.replace( req.headers.origin as string, '' );

        passport.authenticate( "google", { scope: [ "profile", "email" ] } )( req, res, next );
    }



    public facebookAuth(req: Request, res: Response, next: NextFunction) {

        if ( req.headers.referer ) (req as any).session.auth_ref = req.headers.referer.replace( req.headers.origin as string, '' );

        passport.authenticate( "facebook", { scope : [ "email" ] } )( req, res, next );
    }



    public twitterAuth(req: Request, res: Response, next: NextFunction) {

        if ( req.headers.referer ) (req as any).session.auth_ref = req.headers.referer.replace( req.headers.origin as string, '' );

        passport.authenticate( "twitter" )( req, res, next );
    }



    public OAuthCallback(req: Request, res: Response, next: NextFunction) {

        res.cookie(
            "subscribed_to_uidesigndaily",
            true,
            {
                domain: process.env.NODE_ENV === "production" ? "uidesigndaily.com" : "localhost",
                // Cookie expires in 5 years
                expires: new Date( Date.now() + 60 * 60 * 1000 * 24 * 365 * 5 ),
                sameSite: true

            });

        if ( (req as any).session.auth_ref ) {
            res.redirect( (req as any).session.auth_ref );
        } else {
            res.redirect( '/' );
        }

    }



    public subscribe = async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        if ( ! ValidationHelper.validateEmail( email ) ) {
            res.json( { success: false, message: "Invalid subscription credentials. Please provide a valid email address to subscribe." } );
            return;
        }

        const md5email = await this.mailChimpSubscribe( email );

        if ( ! md5email ) return res.status( 500 ).json( { success: false, message: "Internal server error. Failed to subscribe!" } );

        res.cookie(
            "subscribed_to_uidesigndaily",
            true,
            {
                domain: process.env.NODE_ENV === "production" ? "uidesigndaily.com" : "localhost",
                // Cookie expires in 5 years
                expires: new Date( Date.now() + 60 * 60 * 1000 * 24 * 365 * 5 ),
                sameSite: true

            });

        await this.sendSubscribedEmail( email, md5email );

        res.status( 200 ).json( { success: true, message: "You successfully subscribed for UI Design Daily!" } );

    };



    public unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;


        axios.patch(
            `https://us4.api.mailchimp.com/3.0/lists/3c26614105/members/${ id }`,
            {
                status: "unsubscribed"
            },
            {
                headers: {
                    Authorization: process.env.MAILCHIMP_KEY
                }
            }
        )
            .then( () => res.render( "unsubscribed", { title: "UI Design Daily | Successfully Unsubscribed" } ) )
            .catch( next );
    };



    private getGoogleStrategy(): any {
        // noinspection TypeScriptValidateTypes
        return new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.APP_DOMAIN + "/api/v1/subscriptions/google/callback"
        }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

            const firstName     = profile.name.givenName;
            const lastName      = profile.name.familyName;
            const email         = profile.emails[0].value;

            let subscriber      = await Subscriber.findOne({ email } );

            if ( ! subscriber ) {

                subscriber = new Subscriber({
                    firstName,
                    lastName,
                    email
                });


                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );

            } else {
                subscriber.firstName    = firstName;
                subscriber.lastName     = lastName;

                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );
            }

            return done( null, subscriber );
        });
    }



    private getFacebookStrategy(): any {
        // noinspection TypeScriptValidateTypes
        return new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: process.env.APP_DOMAIN + "/api/v1/subscriptions/facebook/callback",
            profileFields: [ "id", "emails", "name", "photos" ]
        }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

            const firstName     = profile.name.givenName;
            const lastName      = profile.name.familyName;
            const email         = profile.emails[0].value;

            let subscriber      = await Subscriber.findOne({ email } );

            if ( ! subscriber ) {

                subscriber = new Subscriber({
                    firstName,
                    lastName,
                    email
                });


                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );

            } else {
                subscriber.firstName    = firstName;
                subscriber.lastName     = lastName;

                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );
            }

            return done( null, subscriber );
        });
    }



    private getTwitterStrategy(): any {
        // noinspection TypeScriptValidateTypes
        return new TwitterStrategy({
            consumerKey: process.env.TWITTER_KEY,
            consumerSecret: process.env.TWITTER_SECRET,
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            callbackURL: process.env.APP_DOMAIN + "/api/v1/subscriptions/twitter/callback",
            profileFields: [
                "id",
                "first-name",
                "last-name",
                "email-address"
            ]
        }, async (token: string, tokenSecret: string, profile: any, done: Function) => {

            const names = profile._json.name.split( ' ' );

            const firstName     = names[0];
            const lastName      = names[1];
            const email         = profile.emails[0].value;

            let subscriber      = await Subscriber.findOne({ email } );

            if ( ! subscriber ) {

                subscriber = new Subscriber({
                    firstName,
                    lastName,
                    email
                });


                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );

            } else {
                subscriber.firstName    = firstName;
                subscriber.lastName     = lastName;

                await subscriber.save();

                /** Subscribe the user to our mailing list */
                const md5Email = await this.mailChimpSubscribe( firstName, lastName, email );

                /** Send subscribe confirmation */
                await this.sendSubscribedEmail( email, md5Email );
            }

            return done( null, subscriber );
        });
    }



    public mailChimpSubscribe = async (email: string, firstName?:string, lastName?: string): Promise<string> => {

        let md5email = crypto.createHash( "md5" ).update( email ).digest( "hex" );

        let response;

        try {
            response = await axios.get(
                `https://us4.api.mailchimp.com/3.0/lists/3c26614105/members/${ md5email }`,
                {
                    headers: {
                        Authorization: process.env.MAILCHIMP_KEY
                    }
                }
            );


            if ( response.data.status === "subscribed" ) return md5email;

        } catch (e) {
            /** 404 means email is not subscribed yet. => WE PROCEED. */
        }

        /** If the user exists but is unsubscribed. */

        if ( response && response.data.status === "unsubscribed" ) {

            try {
                await axios.patch(
                    `https://us4.api.mailchimp.com/3.0/lists/3c26614105/members/${ md5email }`,
                    {
                        status: "subscribed"
                    },
                    {
                        headers: {
                            Authorization: process.env.MAILCHIMP_KEY
                        }
                    }
                );

                return md5email;

            } catch (e) {
                console.error( e );

                return '';
            }

        } else {

            /** If the user doesn't exist */

            let data: any;

            if ( firstName && lastName ) {
                data = {
                    members: [
                        {
                            email_address: email,
                            status: "subscribed",
                            merge_fields: {
                                FNAME: firstName,
                                LNAME: lastName
                            }
                        }
                    ]
                };
            } else {
                data = {
                    members: [
                        {
                            email_address: email,
                            status: "subscribed"
                        }
                    ]
                };
            }

            try {
                await axios.post(
                    "https://us4.api.mailchimp.com/3.0/lists/3c26614105",
                    data,
                    {
                        headers: {
                            Authorization: process.env.MAILCHIMP_KEY
                        }
                    }
                );

                return md5email;
            } catch (e) {
                console.error( e );

                return '';
            }

        }

    };



    public sendSubscribedEmail = async(email: string, md5email: string) => {

        if ( ! email || ! md5email ) return console.error( "Cannot send subscribed email. Invalid inputs provided" );

        try {
            const smtpTransport = nodemailer.createTransport( mg({
                auth: {
                    api_key: process.env.MAILGUN_KEY as string,
                    domain: process.env.MAILGUN_DOMAIN as string,
                }
            }));

            const template = handlebars.compile( subscribedEmailTemplate );

            const html = template({
                unSubscribe: `https://us4.api.mailchimp.com/3.0/lists/3c26614105/members/${ md5email }`
            });

            const mailOptions = {
                from: `Ildiko <ildiko@uidesigndaily.com>`,
                to: email,
                subject: `Thanks for subscribing to UIDesignDaily!`,
                html
            };


            await smtpTransport.sendMail( mailOptions, (err: any) => {
                if ( err ) console.error( err );
            });

        } catch (e) {
            console.error( e );
        }
    };
}



export default new SubscriptionController();