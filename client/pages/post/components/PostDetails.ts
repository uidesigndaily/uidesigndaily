
import {SnackBarType} from "../../../common/snackbar/SnackBarType";
import {AdFactory} from "../../../common/ads/AdFactory";
import {HTMLHelper} from "../../../helpers/HTMLHelper";
import {DateHelper} from "../../../helpers/DateHelper";
import {AdType} from "../../../common/ads/AdType";
import {View} from "../../../core/View";
import {Page} from "../../../core/Page";





export class PostDetails extends View {
    private page: Page;

    private title: HTMLElement;
    private date: HTMLElement;
    private description: HTMLElement;
    private software: HTMLElement;
    private image: HTMLImageElement;

    private tags: HTMLElement;
    private colors: HTMLElement;

    private downloadBtn: HTMLButtonElement;

    private timer: any;



    constructor(page: Page) {
        super( "PostDetails" );

        this.page                   = page;

        this.title                  = document.getElementById( "post-details-post-title" );
        this.date                   = document.getElementById( "post-details-post-date" );
        this.description            = document.getElementById( "post-details-post-description" );
        this.software               = document.getElementById( "post-software" );
        this.image                  = document.getElementById( "post-preview-image" ) as HTMLImageElement;

        this.tags                   = document.getElementById( "tag-container" );
        this.colors                 = document.getElementById( "colors-container" );

        this.downloadBtn            = document.getElementById( "post-details-download-source-file-btn" ) as HTMLButtonElement;


        this.configure();

        AdFactory.getAd( AdType.POST, true );

        this.registerEventListeners();
    }



    private registerEventListeners () {

        this.downloadBtn.addEventListener( "click", () => {

            if ( this.timer && new Date().getTime() - this.timer < 3000 ) return;

            window.open( this.page.data.source );

            this.connection.downloadedPost( this.page.data._id )
                .done( (post: any) => console.log( post ) )
                .fail( (err: Error) => console.error( err ) );

            this.timer = new Date().getTime();
        });
    }



    private configure(): void {

        this.image.src = this.page.data.image;

        this.title.innerText = this.page.data.title;

        if ( this.page.data.description ) {
            this.description.innerText      = this.page.data.description;
            this.description.style.display  = "block";
        } else {
            this.description.style.display  = "none";
        }

        this.date.innerText                 = DateHelper.getParsedDate( this.page.data.date );
        

        for ( let tag of this.page.data.tags ) {
            const t         = document.createElement( "div" );
            t.className     = "tag";
            t.innerText     = tag;

            this.tags.appendChild( t );
        }

        this.software.classList.add( this.page.data.software );

        if ( this.page.data.software === "xd" ) {
            this.software.innerText = "Adobe XD";
        } else {
            this.software.innerText = this.page.data.software.charAt(0).toUpperCase() + this.page.data.software.substring(1);
        }


        for ( let color of this.page.data.colors ) {

            color = color.toUpperCase();

            let wrapper = document.createElement( "div" );
            wrapper.className = "color-wrapper";

            let preview = document.createElement( "div" );
            preview.className = "color-preview";
            preview.style.backgroundColor = color;

            let code = document.createElement( "div" );
            code.className = "color-code";
            code.innerText = color;

            wrapper.appendChild( preview );
            wrapper.appendChild( code );

            this.colors.appendChild( wrapper );

            wrapper.addEventListener( "click", () => {

                HTMLHelper.copyToClipboard( code.innerText );

                this.snackback.show( SnackBarType.SUCCESS,"Color code copied to clipboard." );
            });

        }

    }

}
