
import {ConnectionProxy} from "../../connection/ConnectionProxy";
import {AdImagePosition} from "./constants/AdImagePosition";
import {HTMLHelper} from "../../helpers/HTMLHelper";
import {AdFactory} from "./AdFactory";

const template = require( "../../templates/post-ad.html" );





export class PostAd {
    private parent: HTMLElement;
    private container: HTMLAnchorElement;
    private image: HTMLImageElement;
    private connection: ConnectionProxy;
    private data: any;
    private isDisplayed: boolean;



    constructor(adData: any) {

        this.data                   = adData;

        this.connection             = new ConnectionProxy();

        this.parent                 = document.getElementById( "sup-wrapper" );

        this.container              = document.createElement( 'a' );

        this.container.target       = "_blank";
        this.container.rel          = "nofollow";

        this.container.href         = this.data.link;

        this.container.innerHTML    = template;

        this.image                  = this.container.querySelector( "img" ) as HTMLImageElement;

        const img = this.data.images.filter( (i: any) => i.position === AdImagePosition.POST )[0];

        if ( img ) {
            this.image.src  = `/api/v1/sup-images/${ img._id }`;
            this.image.alt  = `Promoted Content: ${ this.data.title }`;
        }

        this.parent.appendChild( this.container );

        this.checkAdDisplayed = this.checkAdDisplayed.bind( this );

        this.enterScene();

    }



    private registerEventListeners(): void {

        this.container.addEventListener( "click", () => {

            this.connection.registerAdClick( this.data._id, AdImagePosition.POST );
        });

        window.addEventListener( "scroll", this.checkAdDisplayed );
    }



    private checkAdDisplayed(): void {

        if ( this.isDisplayed ) return;

        if ( HTMLHelper.isElementInViewport( this.container ) ) {
            this.isDisplayed = true;

            AdFactory.recordImpression( this.data._id );

            window.removeEventListener( "scroll", this.checkAdDisplayed );
        }
    }



    private enterScene(): void {

        this.registerEventListeners();

        this.checkAdDisplayed();
    }

}
