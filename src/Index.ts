import * as debug from "debug";
import * as http from "http";

const bugsnag       = require( "@bugsnag/js" );
const bugsnagClient = bugsnag( "78c93a709288703bfc0a74d4990300a5" );

import Server from "./Server";

debug( "ts-express:server" );

const port = normalizePort( process.env.PORT || 3000 );
Server.set( "port", port );

console.log( `Server listening on port ${ port }` );

const server = http.createServer( Server );



server.listen( port );
server.on( "error", onError );
server.on( "listening", onListening );
process.on( "uncaughtException", reportError );



function normalizePort( val: number | string): number | string | boolean {
    const port: number = typeof val === "string" ? parseInt( val, 10 ) : val;

    if ( isNaN( port ) ) {
        return val;
    } else if ( port >= 0 ) {
        return port;
    } else {
        return false;
    }
}



function reportError(error: NodeJS.ErrnoException): void {
    if ( process.env.NODE_ENV === "production" ) bugsnagClient.notify( error );
}



function onError(error: NodeJS.ErrnoException): void {

    reportError( error );

    if ( error.syscall !== "listen" ) {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch ( error.code ) {

        case "EACCES" :
            console.error( `${ bind } requires elevated privileges` );
            process.exit(1);
            break;

        case "EADDRINUSE" :
            console.error( `${ bind } is already in use` );
            process.exit( 1 );
            break;

        default:
            throw error;

    }
}



function onListening(): void {
    const address   = server.address();
    let bind        = null;

    if ( address ) {
        // noinspection TypeScriptUnresolvedVariable
        bind = typeof address === "string" && address !== null ? `pipe ${ address }` : `port ${ address!.port }`;
    }

    debug( `Listening on ${ bind }` );
}
