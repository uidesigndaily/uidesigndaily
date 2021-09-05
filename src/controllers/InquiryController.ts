
import {Router, Request, Response, NextFunction} from "express";


import Inquiry from "../models/Inquiry";
import * as nodemailer from "nodemailer";
import * as mg from "nodemailer-mailgun-transport";
import * as fs from "fs-extra";
import * as path from "path";

const handlebars = require( "handlebars" );

const contactEmailTemplate = fs.readFileSync( path.join( __dirname, "../../templates/inquiry.hbs" ), "utf8" );





class InquiryController {

    router: Router;




    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( '/', this.createInquiry );
    }



    public createInquiry(req: Request, res: Response, next: NextFunction): void {
        const { name, email, subject, message } = req.body;

        const inquiry = new Inquiry({
            name,
            email,
            subject,
            message
        });


        inquiry.save()
            .then( inq => {

                try {

                    const smtpTransport = nodemailer.createTransport( mg({
                        auth: {
                            api_key: process.env.MAILGUN_KEY as string,
                            domain: process.env.MAILGUN_DOMAIN as string,
                        }
                    }));

                    const template = handlebars.compile( contactEmailTemplate );

                    const html = template({
                        name,
                        email,
                        subject,
                        message
                    });

                    const mailOptions = {
                        from: `${ name } <${ email }>`,
                        to: "andrei@uidesigndaily.com, ildiko@uidesigndaily.com",
                        subject: `UIDD Contact: ${ subject }`,
                        html
                    };


                    smtpTransport.sendMail( mailOptions, (err: any) => {
                        if ( err ) {
                            console.error( err );

                            return res.status( 500 ).json({
                                error: "Sending contact email failed."
                            });

                        }

                        res.status( 200 ).json( inq );
                    });
                } catch (e) {
                    console.error( e );
                }
            })
            .catch( next );
    }

}


export default new InquiryController().router;