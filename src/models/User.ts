
import { Schema, model, Model } from "mongoose";
import { IUser } from "./interfaces/IUser";


const fs        = require( "fs" );
const bcrypt    = require( "bcrypt" );

const SALT_WORK_FACTOR = 10;

const uploadsPath = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "uploads";





const UserSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (name: string) => name.length > 1 && name.length <= 30,
            msg: "First name has to to be at least two characters in length, but not longer than 30."
        }
    },

    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (name: string) => name.length > 1 && name.length <= 30,
            msg: "Last name has to to be at least two characters in length, but not longer than 30."
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test( email );
            },
            msg: "Please provide a valid email address."
        }
    },

    password: {
        type: String,
        validate: {
            validator: (password: string) => password.length > 7 && password.length < 75,
            msg: "Password must contain 7 or more characters."
        }
    },

    resetPasswordToken: String,

    resetPasswordExpires: Date,

    isConfirmed: {
        type: Boolean,
        default: false
    },

    isAdmin: Boolean

}, { timestamps: true });



UserSchema.pre( "save", function (next) {
    let user = (this as any);

    /** Only hash the password if it has been modified or new */

    if ( ! user.isModified("password" ) ) return next();

    /** Generate salt */
    bcrypt.genSalt( SALT_WORK_FACTOR, (err: any, salt: any) => {
        if ( err ) return next( err );

        /** Hash the password with the salt */
        bcrypt.hash( user.password, salt, (err: any, hash: any) => {
            if ( err ) return next( err );

            /** Override clear-text password */
            user.password = hash;
            next();
        });
    });
});



UserSchema.pre('save', function(next) {

    if ( this.isNew ) {
        fs.mkdir( `${ uploadsPath }/${ this._id }`, next );
    } else {
        next();
    }
});



// noinspection TypeScriptUnresolvedVariable
UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {

    let password = this.password;

    return new Promise((resolve, reject) => {

        bcrypt.compare(candidatePassword, password, (err: any, success: any) => {

            if ( err ) return reject( err );
            return resolve( success );

        });

    });

};



const User: Model<IUser> = model<IUser>( "User", UserSchema );

export default User;