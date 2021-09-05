
import {CookieBanner} from "../common/cookies/CookieBanner";
import {CoreEntity} from "./CoreEntity";

declare const TweenLite: any;
declare const Power0: any;

declare const DATA_SOURCE: any;



export class Page extends CoreEntity {
    public NAME: string;
    public data: any;

    private cookieBanner: CookieBanner;

    constructor(pageName: string, template: string) {
        super( pageName );
        this.NAME = pageName;
        document.getElementById( "main-container" ).innerHTML += template;

        this.loadData();


        this.cookieBanner   = new CookieBanner();
    }



    private loadData(): void {

        if ( typeof DATA_SOURCE === "undefined"  ) return;

        this.data       = DATA_SOURCE;

        const dataSrc   = document.getElementById( "data-source" );

        if ( dataSrc ) dataSrc.parentNode.removeChild( dataSrc );
    }



    public displayNotification(type: string, message: string) {

        let notification = document.createElement( "div" );
        notification.className = "notification";

        document.body.appendChild( notification );

        TweenLite.to( notification,
            0.3,
            {
                top: "10px",
                opacity: 1,
                ease: Power0.easeOut,
                onComplete: () => {

                    setTimeout( () => {
                        if ( notification ) {
                            notification.parentNode.removeChild( notification );
                        }
                    }, 2000 );
                }
            });

    }


}