
import User from "../models/User";





export default function () {

    User.findOne({ email: process.env.ADMIN_EMAIL })
        .then( async res => {
            if ( res ) {

                res.firstName   = process.env.ADMIN_FNAME as string;
                res.lastName    = process.env.ADMIN_LNAME as string;
                res.isAdmin     = true;

                await res.save();

                return;
            }

            const user = new User({
                firstName: process.env.ADMIN_FNAME,
                lastName: process.env.ADMIN_LNAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                isAdmin: true
            });

            user.save()
                .then( () => console.log( "Admin created" ) )
                .catch( (err: Error) => console.error( err ) );
        });
}
