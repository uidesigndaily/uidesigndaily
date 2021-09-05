
import {Router, Request, Response, NextFunction} from "express";
import RequireAuthentication from "../middlewares/RequireAuthentication";
import {EventService} from "../services/EventService";
import {DataHelper} from "../helpers/DataHelper";
import AdImage from "../models/AdImage";
import Ad from "../models/Ad";



class AdController {

    router: Router;



    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.getAds );
        this.router.post( '/', RequireAuthentication, this.createAd );
        this.router.delete( "/:id", RequireAuthentication, this.deleteAd );
        this.router.put( "/impressions", this.registerImpressions );
        this.router.put( "/click", this.registerClick );
    }



    public registerClick = async (req: Request, res: Response, next: NextFunction) => {

        const { id, position } = req.body;

        if ( ! id ) return res.status( 500 ).json( { error: "Invalid input" } );

        const ad = await Ad.findByIdAndUpdate( id, { $inc: { clicks: 1 } } );

        if ( ! ad ) return res.status( 404 ).json( { message: "Not found." } );

        res.status( 200 ).json( { message: "Click registered." } );

        const identifier    = ad._id;
        const name          = ad.title;
        const link          = ad.link;

        EventService.adClick(
            identifier,
            name,
            DataHelper.getAdPositionReadable( position ),
            link
        );
    };



    public registerImpressions = async (req: Request, res: Response, next: NextFunction) => {

        const impressions = req.body;

        if ( ! impressions ) res.status( 500 ).json( { error: "Invalid input." } );

        for ( let ad in impressions ) {

            if ( impressions.hasOwnProperty( ad ) ) {

                await Ad.findByIdAndUpdate( ad, { $inc: { impressions: parseInt( impressions[ad] ) } } );
            }
        }

        res.status( 200 ).json( { message: "Impressions registered." } );
    };



    public createAd(req: Request, res: Response, next: NextFunction) {

        const ad = new Ad( req.body );

        ad.save()
            .then( (ad: any) => res.status( 200 ).json( ad ) )
            .catch( next );
    }



    public deleteAd = async (req: Request, res: Response, next: NextFunction) => {

        const ad = await Ad.findById( req.params.id );

        if ( ! ad ) return res.status( 404 ).json( { error: "Ad not found." } );

        await AdImage.deleteMany( { "_id": { $in: ad.images } } );

        await Ad.findByIdAndDelete( ad._id );

        res.status( 200 ).json( ad );
    };



    public getAds(req: Request, res: Response, next: NextFunction) {

        Ad.find()
            .populate( "images", "_id position" )
            .then( (ads: any[]) => {
                res.status( 200 ).json( ads );
            })
            .catch( next );
    }

}


export default new AdController().router;
