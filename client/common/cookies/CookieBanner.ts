

import {ConnectionProxy} from "../../connection/ConnectionProxy";
import {CookieHelper} from "../../helpers/CookieHelper";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


// CSS
import "../../style/cookie-banner.scss";


// HTML
const template = require( "../../templates/cookie-banner.html" );


export class CookieBanner {
    private container: HTMLElement;
    private closeCookie: HTMLElement;
    private cookieBanner: HTMLElement;



    constructor() {

        this.container              = document.createElement( "div" );
        this.container.id           = "cookie-banner-container";
        this.container.innerHTML    = template;

        document.getElementById( "main-container" ).appendChild( this.container );

        this.closeCookie    = document.getElementById( "close-cookie-btn" );
        this.cookieBanner   = document.getElementById( "cookie-banner" );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.closeCookie.addEventListener( "click", () => {

            this.cookieBanner.classList.remove( "active" );

            let connection = new ConnectionProxy();

            connection.dismissCookieNotification()
                .done( () => "Cookie notification dismissed successfully." )
                .fail( (err: Error) => console.error( err ) )

        });

    }



    private initCookieBanner(): void {
        if ( ! CookieHelper.exists( "cookie_dismissed" ) ) {
            setTimeout( () => this.cookieBanner.classList.add( "active" ), 2000 );
        }
    }



    private enterScene(): void {
        this.registerEventListeners();
        this.initCookieBanner();
    }

}
