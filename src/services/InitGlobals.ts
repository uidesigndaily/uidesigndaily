
import Globals from "../models/Globals";





export default function () {

    Globals.findOne()
        .then( res => {
            if ( res ) return;

            const topics = new Globals();

            topics.save()
                .then( () => console.log( "Globals created" ) )
                .catch( (err: Error) => console.error( err ) );
        });
}