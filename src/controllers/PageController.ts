

import { Router, Request, Response } from "express";
import RequireAuthentication from "../middlewares/RequireAuthentication";
import Post from "../models/Post";


const publicPath = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "public";



class PageController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {

        /** Website */

        this.router.get( '/', this.index );
        this.router.get( "/about", this.about );
        this.router.get( "/contact", this.contact );
        this.router.get( "/license", this.license );
        this.router.get( "/posts/:slug", this.post );
        this.router.get( "/privacy", this.privacy );
        this.router.get( "/terms", this.terms );
        this.router.get( "/upload", RequireAuthentication, this.upload );
        this.router.get( "/hq", this.authentication );
        this.router.get( "/slack-invite", this.slackInvite );
        this.router.get( "/get-premium", this.getPremium );
        this.router.get( "/admin-dashboard", RequireAuthentication, this.adminDashboard );

        /** React Routes */

        this.router.get( "/react-test", this.react );
    }



    public index(req: Request, res: Response) {
        res.render( "index", {
            title: "UI Design Daily | Weekly FREE UI resources straight to your inbox",
            index: true
        });
    }



    public about(req: Request, res: Response) {
        res.render( "about", { title: "UI Design Daily | About UI Design Daily" } );
    }



    public contact(req: Request, res: Response) {
        res.render( "contact", { title: "UI Design Daily | Contact Us" } );
    }



    public license(req: Request, res: Response) {
        res.render( "license", { title: "UI Design Daily | Licensing Agreement" } );
    }



    public post = async (req: Request, res: Response) => {

        const { slug } = req.params;

        const post = await Post.findOne( { slug } );

        if ( ! post ) return res.render( "404", { title: "UI Design Daily | Not Found" } );

        res.render( "post", {
            title: `UI Design Daily | ${ post.title }`,
            description: post.title,
            post: JSON.stringify( post ),
            software: post.software.charAt(0).toUpperCase() + post.software.substring(1),
            image: post.image,
            slug: post.slug
         });
    };



    public privacy(req: Request, res: Response) {
        res.render( "privacy", { title: "UI Design Daily | Privacy Policy" } );
    }



    public terms(req: Request, res: Response) {
        res.render( "terms", { title: "UI Design Daily | Terms & Conditions" } );
    }



    public slackInvite(req: Request, res: Response) {
        res.render( "slack_invite", { title: "UI Design Daily | Slack Invitation" } );
    }



    public upload(req: Request, res: Response) {
        res.render( "upload", { title: "UI Design Daily | Upload" } );
    }



    public authentication(req: Request, res: Response) {
        res.render( "authentication", { title: "UI Design Daily | Authentication" } );
    }



    public getPremium(req: Request, res: Response) {
        res.render( "get-premium", { title: "UI Design Daily | Get Premium" } );
    }



    public adminDashboard(req: Request, res: Response) {
        res.render( "admin-dashboard", { title: "UI Design Daily | Admin Dashboard" } );
    }



    public react(req: Request, res: Response) {
        res.sendFile( publicPath + "/react/index.html" );

    }
}


export default new PageController().router;