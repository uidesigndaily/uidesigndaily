
import {ConnectionProxy} from "../../connection/ConnectionProxy";
import {AdImagePosition} from "./constants/AdImagePosition";
import {HTMLHelper} from "../../helpers/HTMLHelper";
import {AdFactory} from "./AdFactory";

const template = require( "../../templates/gallery-card-ad.html" );





export class GalleryCardAd {
    private parent: HTMLElement;
    private container: HTMLAnchorElement;
    private title: HTMLElement;
    private description: HTMLElement;
    private image: HTMLImageElement;
    private connection: ConnectionProxy;
    private data: any;
    private isDisplayed: boolean;


    constructor(adData: any) {

        this.data                   = adData;

        this.connection             = new ConnectionProxy();

        this.parent                 = document.getElementById( "post-listing" );

        this.container              = document.createElement( 'a' ) as HTMLAnchorElement;

        this.container.className    = "design-thumbnail";

        this.container.href         = this.data.link;

        this.container.target       = "_blank";
        this.container.rel          = "nofollow";

        this.container.innerHTML    = template;

        this.title                  = this.container.querySelector( ".design-title" ) as HTMLElement;
        this.description            = this.container.querySelector( ".upload-date" ) as HTMLElement;

        this.title.innerText        = this.data.title;
        this.description.innerText  = this.data.description;

        this.image                  = this.container.querySelector( "img" ) as HTMLImageElement;

        const img = this.data.images.filter( (i: any) => i.position === AdImagePosition.GALLERY_CARD )[0];

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

            this.connection.registerAdClick( this.data._id, AdImagePosition.GALLERY_CARD );
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
