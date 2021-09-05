

import {Router, Request, Response, NextFunction} from "express";
import RequireAuthentication from "../middlewares/RequireAuthentication";
import ValidateUpload from "../middlewares/ValidateUpload";
import {EventService} from "../services/EventService";
import Globals from "../models/Globals";
import Post from "../models/Post";
import * as fs from "fs-extra";

const ColorThief    = require( "colorthief" );

const multer        = require( "multer" );
const uploadsPath   = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "uploads";

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: Function) => cb( null, `${ uploadsPath }/temp` ),
    filename: (req: Request, file: any, cb: Function) => cb( null, file.originalname )
} as any);

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024,  // 100 MB upload limit
    }});

const thumb = require( "node-thumbnail" ).thumb;



class PostController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post(
            '/',
            RequireAuthentication,
            upload.fields([ { name: "source", maxCount: 1 }, { name: "image", maxCount: 1 } ] ),
            ValidateUpload,
            this.createPost
        );
        this.router.post( "/search", this.searchPosts );
        this.router.put( "/downloaded/:id", this.downloadedPost );
    }



    public createPost = async (req: Request, res: Response, next: NextFunction) => {

        const files = (req as any).files;

        // console.log( "BODY", req.body );
        // console.log( "FILES", files );


        /** Validate Request */

        if ( ! files || ! files.source || ! files.image ) return res.status( 400 ).json({
            error: "Source and image files are mandatory to create a post."
        });


        if ( files.source[0].originalname.endsWith( ".jpg" ) ) return res.status( 400 ).json({
            error: ".jpg is not a source file."
        });

        if ( files.source[0].originalname.endsWith( ".png" ) ) return res.status( 400 ).json({
            error: ".png is not a source file."
        });

        if ( files.source[0].originalname.endsWith( ".gif" ) ) return res.status( 400 ).json({
            error: ".gif is not a source file."
        });

        if ( files.image[0].originalname.endsWith( ".psd" ) ) return res.status( 400 ).json({
            error: ".psd is not an image file."
        });

        if ( files.image[0].originalname.endsWith( ".sketch" ) ) return res.status( 400 ).json({
            error: ".sketch is not an image file."
        });

        if ( files.image[0].originalname.endsWith( ".studio" ) ) return res.status( 400 ).json({
            error: ".studio is not an image file."
        });

        if ( files.image[0].originalname.endsWith( ".xd" ) ) return res.status( 400 ).json({
            error: ".xd is not an image file."
        });

        let { day, title, description, tags, date, software } = req.body;

        if ( day == null || day < 1 ) return res.status( 400 ).json({
            error: "Day is a required number property, and it cannot be lower 1."
        });

        /** Find if post already exist */

        if ( fs.existsSync( `${ uploadsPath }/${ day }` ) ) {

            console.log( "File already exists." );

            await Post.findOneAndDelete( { day } );

            fs.removeSync( `${ uploadsPath }/${ day }` );

            console.log( "Post deleted, directory removed." );
        } else {
            console.log( "File doesn't exist." );
        }


        tags        = tags.split( ',' );

        tags        = tags.map( (t: any) => t.trim() );

        software    = software.trim().toLowerCase();

        await Globals.findOneAndUpdate({}, { $addToSet: { tags, software } } );

        const swatches = await ColorThief.getPalette( files.image[0].path, 6 );

        console.log( "Color Thief Swatches", swatches );

        const color = await ColorThief.getColor( files.image[0].path );

        console.log( "Color Thief Color", color );

        let colors = [];

        for ( let swatch of swatches )
            colors.push( this.rgbToHex( swatch[0], swatch[1], swatch[2] ) );


        const dominantColor = this.rgbToHex( color[0], color[1], color[2] );

        const slug = this.generateSlug( software, title, tags, day );

        const post = new Post({
            day,
            title,
            description,
            tags,
            date,
            software,
            colors,
            dominantColor,
            slug
        });

        /** Rename files */

        const sourceEXT     = files.source[0].filename.split( '.' )[1];
        const imageEXT      = files.image[0].filename.split( '.' )[1];


        fs.renameSync( `${ uploadsPath }/temp/${ files.source[0].filename }`, `${ uploadsPath }/temp/day_${ post.day }.${ sourceEXT }` );
        fs.renameSync( `${ uploadsPath }/temp/${ files.image[0].filename }`, `${ uploadsPath }/temp/day_${ post.day }.${ imageEXT }` );


        await thumb({
            width: 500,
            source: `${ uploadsPath }/temp/day_${ post.day }.${ imageEXT }`,
            destination: `${ uploadsPath }/temp`
        });


        /** Copy files and empty directory */

        fs.copySync( `${ uploadsPath }/temp`, `${ uploadsPath }/${ post.day }` );
        fs.emptyDirSync( `${ uploadsPath }/temp` );


        const sourcePath    = `/uploads/${ post.day }/day_${ post.day }.${ sourceEXT }`;
        const imagePath     = `/uploads/${ post.day }/day_${ post.day }.${ imageEXT }`;

        const thumbnailPath = `/uploads/${ post.day }/day_${ post.day }_thumb.${ imageEXT }`;


        post.source         = sourcePath;
        post.image          = imagePath;
        post.thumbnail      = thumbnailPath;

        await post.save();

        res.status( 200 ).json( post )

    };



    public searchPosts(req: Request, res: Response, next: NextFunction) {
        let { batch, limit, substring, software, tags } = req.body;

        let query: any = {};

        if ( substring )                    query.title         = { $regex: substring, $options: 'i' };

        if ( software )                     query.software      = software;

        if ( tags && tags.length )          query.tags          = { $in: tags };

        if ( ! batch )                      batch               = 0;

        if ( ! limit )                      limit               = 25;

        // console.log( query );

        Post.find( query )
            .sort({ date: -1 } )
            .skip ( parseInt( batch ) * parseInt( limit ) )
            .limit( parseInt( limit ) )
            .then( posts => res.status( 200 ).json( posts ) )
            .catch( next );

        EventService.postSearch( substring, software, tags );
    }



    public downloadedPost (req: Request, res: Response, next: NextFunction): void {

        Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
        { "new": true }
        )
            .then( post => {

                res.status( 200 ).json( post );

                if ( post ) EventService.postDownloaded( post );
            })
            .catch( next );
    };



    private generateSlug (software: string, title: string, tags: string[], day: number): string {

        let slugArr = [];

        slugArr.push( software.toLowerCase().trim().replace(  / /g, '-' ) );

        let titleArr = title.toLowerCase().trim().split( ' ' );

        for ( let t of titleArr ) slugArr.push( t );

        for ( let tag of tags ) {

            let tagArr = tag.toLowerCase().trim().split( ' ' );

            for ( let t of tagArr ) slugArr.push( t );

        }

        slugArr.push( `day-${ day }` );

        slugArr = [ ... new Set( slugArr ) ]; // Remove duplicates, maybe SEO doesn't like them

        let slug = slugArr.join( '-' );

        slug = encodeURI( slug );

        return slug;
    }



    private rgbToHex = (r: number, g: number, b: number): string => '#' + [r, g, b].map(x => {

        const hex = x.toString( 16 );

        return hex.length === 1 ? '0' + hex : hex
    }).join('');

}


export default new PostController().router;
