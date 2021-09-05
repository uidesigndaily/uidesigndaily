

import { Application, NextFunction, Request, Response } from "express";


import * as dotenv from "dotenv";
dotenv.config();

// Add this to the VERY top of the first file loaded in your app
// const apm = require( "elastic-apm-node" ).start({
//     // Override service name from package.json
//     // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//     serviceName: 'UI Design Daily',
//
//     // Use if APM Server requires a token
//     secretToken: process.env.APM_TOKEN,
//
//     // Set custom APM Server URL (default: http://localhost:8200)
//     serverUrl: process.env.APM_URL
// });


import AuthenticationController from "./controllers/AuthenticationController";
import Subscription from "./controllers/SubscriptionController";
import GlobalsController from "./controllers/GlobalsController";
import InquiryController from "./controllers/InquiryController";
import AdImageController from "./controllers/AdImageController";
import CookieController from "./controllers/CookieController";
import PageController from "./controllers/PageController";
import PostController from "./controllers/PostController";
import AdController from "./controllers/AdController";
import Database from "./configs/DatabaseConfig";

import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import * as session from "express-session";
import * as hbs from "express-handlebars";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as mongoose from "mongoose";
import * as express from "express";
import * as helmet from "helmet";
import * as logger from "morgan";
import * as cors from "cors";

import * as connectMongo from "connect-mongo";
const MongoStore = connectMongo( session );

import initGlobals from "./services/InitGlobals";
import initAdmin from "./services/InitAdmin";


const publicPath    = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "public";
const uploadsPath   = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "uploads";





class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.reactStatic();
        this.errors();
    }



    public config() {

        const mongoURL = Database.URI || process.env.DATABASE_URI as string;

        const mongoOPTIONS = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            bufferMaxEntries: 0,
            useUnifiedTopology: true
        };

        const connectWithRetry = function() {

            return mongoose.connect( mongoURL, mongoOPTIONS, (err) => {
                if ( err ) {
                    console.error( "Failed to connect to mongo on startup - retrying in 5 sec", err );
                    setTimeout( connectWithRetry, 5000 );
                }
            });

        };

        connectWithRetry();


        this.app.engine( "hbs", hbs({
            extname: "hbs",
            defaultLayout: "layout",
            layoutsDir: __dirname + "/../views/layouts",
            partialsDir: __dirname + "/../views/partials"
        }) as any );

        this.app.set( "view engine", "hbs" );


        this.app.use( "*/public", express.static( publicPath ) );
        this.app.use( "*/uploads", express.static( uploadsPath ) );
        this.app.use( "/favicon.ico", express.static( publicPath + "/favicon.ico" ) );
        this.app.use( "/robots.txt", express.static( publicPath + "/robots.txt" ) );
        this.app.use( "/sitemap.xml", express.static( publicPath + "/sitemap.xml" ) );


        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( bodyParser.text() );
        this.app.use( logger( "dev" as any ) );
        this.app.use( compression() );
        this.app.use( helmet() );
        this.app.use( cors() );

        this.app.use( cookieParser() );


        let domain;

        switch ( process.env.NODE_ENV ) {

            case "production" :
                domain = "uidesigndaily.com";
                break;

            case "staging" :
                domain = "staging.uidesigndaily.com";
                break;

            default :
                domain = "localhost";
                break;
        }

        this.app.use( session({
            name: "uidd",
            secret: process.env.JWT_SECRET || "nf9S8YuLZs#shXktGWwhqdlQq1",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                domain,
                // Cookie will expire in 14 days
                expires: new Date( Date.now() + 60 * 60 * 1000 * 24 * 14 ),
                sameSite: process.env.NODE_ENV === "production",
                // secure: process.env.NODE_ENV === "production" // TODO: switch back when ADS dashboard finished
                secure: false
            },
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }));


        this.app.use( AuthenticationController.initialize() );

        this.app.use( passport.session() );

        initGlobals();
        initAdmin();
    }



    public routes() {

        this.app.use( '/', PageController );

        this.app.use( process.env.API_BASE + "posts", PostController );

        this.app.use( process.env.API_BASE + "authentication", AuthenticationController.router );

        this.app.use( process.env.API_BASE + "subscriptions", Subscription.router );

        this.app.use( process.env.API_BASE + "cookies", CookieController );

        this.app.use( process.env.API_BASE + "globals", GlobalsController );

        this.app.use( process.env.API_BASE + "contact", InquiryController );

        this.app.use( process.env.API_BASE + "sup", AdController );

        this.app.use( process.env.API_BASE + "sup-images", AdImageController );

    }



    public reactStatic() {
        this.app.use( express.static( publicPath + "/react" ) );
    }



    public errors() {

        this.app.get( '*', (req: Request, res: Response) => {

            res.status( 404 );

            if ( req.accepts( "html" ) ) return res.render( "404", { title: "UIDesignDaily | Page Not Found" } );

            if ( req.accepts( "json" ) ) return res.json( { error: "Not found" } );

            res.send( "Not found" );
        });
    }

}




export default new Server().app;
