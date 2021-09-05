
import { v4 as uuidv4 } from 'uuid';

import Post from "../models/Post";

export default function () {

    Post.find()
        .then( async (posts: any)  => {

            for ( let post of posts ) {
                setSlugUnique( post );
            }

            console.log( "Done." );
        })
        .catch( (err: Error) => console.error( err ))

}


async function setSlugUnique (post: any) {

    let slugArr = [];

    slugArr.push( post.software.toLowerCase().trim().replace(  / /g, '-' ) );

    let titleArr = post.title.toLowerCase().trim().split( ' ' );

    for ( let t of titleArr ) slugArr.push( t );

    for ( let tag of post.tags ) {

        let tagArr = tag.toLowerCase().trim().split( ' ' );

        for ( let t of tagArr ) slugArr.push( t );

    }

    slugArr.push( `day-${ post.day }` );

    slugArr = [ ... new Set( slugArr ) ];

    let slug = slugArr.join( '-' );

    slug = encodeURI( slug );

    post.slug = slug;

    await post.save();

    console.log( slug );

}

async function setSlug (post: any) {

    let slug = post.software.toLowerCase().trim().replace(  / /g, '-' );
    slug += `-${ post.title.toLowerCase().trim().replace( / /g, '-' ) }`;


    for ( let tag of post.tags ) {

        tag = tag.toLowerCase().trim().replace( / /g, '-' );

        slug += `-${ tag }`;
    }

    slug = encodeURI( `${ slug }-day-${ post.day }` );

    post.slug = slug;

    await post.save();

    console.log( slug );

}



async function clearSlug (post: any) {

    post.slug = uuidv4();

    await post.save();

}
