
import {Router, Request, Response, NextFunction} from "express";
import AdImage from "../models/AdImage";
import Ad from "../models/Ad";
import RequireAuthentication from "../middlewares/RequireAuthentication";

import * as multer from "multer"
import * as fs from "fs-extra";
import * as path from "path";

const uploadsPath   = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "uploads";


const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: Function) => cb( null, `${ uploadsPath }` ),
    filename: (req: Request, file: any, cb: Function) => cb( null, file.originalname )
} as any);

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,  // 1MB
    },
    fileFilter: (req: Request, file: any, cb: Function) => {

        if ( [ ".svg", ".jpg", ".jpeg", ".png"].indexOf( path.extname( file.originalname ).toLowerCase() ) === -1 ) {
            return cb( new Error( "Only .svg, .jpg, .png allowed!" ) );
        }

        cb( null, true );
    }
} as multer.Options );



class AdImageController {

    router: Router;



    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/:id', this.getImage );
        this.router.delete( '/:id', this.deleteImage );
        this.router.post( '/',
            upload.single( "image"),
            RequireAuthentication,
            this.createImage );
    }



    public createImage = async (req: Request, res: Response, next: NextFunction) => {

        const { adId, position } = req.body;

        if ( position == null ) return res.status( 200 ).json( { error: "Position is required" } );

        const ad = await Ad.findById( adId );

        if ( ! ad ) return res.status( 200 ).json( { error: "Ad not found" } );

        const image = new AdImage({
            name: req.file.originalname,
            position
        });

        image.img.contentType   = req.file.mimetype;
        image.img.data          = await fs.readFile( req.file.path );


        await image.save();

        ad.images.push( image._id );

        ad.save()
            .then( (ad: any) => res.status( 200 ).json( ad ) )
            .catch( next );

        await fs.unlink( req.file.path );

    };



    public deleteImage = async (req: Request, res: Response, next: NextFunction) => {

        const image = await AdImage.findById( req.params.id );

        if ( ! image ) return res.status( 404 ).json( { error: "Image not found." } );

        const ad = await Ad.findOne( { images: image._id } );

        if ( ! ad ) return res.status( 404 ).json( { error: "Cannot find associated ad." } );

        await AdImage.findByIdAndDelete( image._id );

        ad.images = ad.images.filter( (img: any) => img._id.toString() !== image._id.toString() );

        ad.save()
            .then( (ad:any) => res.status( 200 ).json( ad ) )
            .catch( next );
    };



    public getImage(req: Request, res: Response, next: NextFunction) {

        AdImage.findById( req.params.id )
            .then( (image) => {
                if ( ! image ) return res.status( 404 ).send( "Not found." );

                res.contentType( image.img.contentType );
                res.send( image.img.data );
            })
            .catch( next );
    }

}


export default new AdImageController().router;
