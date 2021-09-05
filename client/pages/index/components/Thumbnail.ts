
import {DateHelper} from "../../../helpers/DateHelper";
import {View} from "../../../core/View";


declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


const template = require( "../../../templates/thumbnail.html" );



export class Thumbnail extends View {

    private container: HTMLAnchorElement;
    private preview: HTMLElement;
    private image: HTMLImageElement;
    private software: HTMLElement;
    private title: HTMLElement;
    private date: HTMLElement;
    // private downloadBtn: HTMLAnchorElement;



    constructor(parent: HTMLElement, data: any) {
        super( `Thumbnail@${ data._id }` );


        this.container              = document.createElement( "a" );
        this.container.className    = "design-thumbnail";

        this.container.innerHTML    = template;

        this.preview                = this.container.querySelector( ".design-preview" ) as HTMLElement;
        this.image                  = this.container.querySelector( "img" ) as HTMLImageElement;
        this.software               = this.container.querySelector( ".software-item" ) as HTMLElement;
        this.title                  = this.container.querySelector( ".design-title" ) as HTMLElement;
        this.date                   = this.container.querySelector( ".upload-date" ) as HTMLElement;
        // this.downloadBtn            = this.container.querySelector( ".download-btn" ) as HTMLAnchorElement;

        this.configure( data );

        parent.appendChild( this.container );

        this.enterScene();
    }



    private registerEventListeners(): void {

        // this.downloadBtn.addEventListener( "click", () => {
        //
        //     this.connection.downloadedPost( this.container.id )
        //         .done( (post: any) => console.log( post ) )
        //         .fail( (err: Error) => console.error( err ) );
        // });

    }



    private configure(data: any): void {

        this.container.href     = `/posts/${ data.slug }`;
        this.container.id       = data._id;

        const software          = data.software.charAt(0).toUpperCase() + data.software.slice(1);

        if ( data.dominantColor ) this.preview.style.backgroundColor = data.dominantColor;

        this.image.src          = data.thumbnail;
        this.image.alt          = `${ data.title } UI, designed with ${ software }.`;


        // this.downloadBtn.href   = data.source;

        this.title.innerText    = data.title;
        this.date.innerText     = DateHelper.getParsedDate( data.date );

        this.software.classList.add( data.software );
        this.software.innerText = software;
    }



    private enterScene(): void {
        this.registerEventListeners();
    }

}
