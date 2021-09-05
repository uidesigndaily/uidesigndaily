
import {SnackBarType} from "./SnackBarType";
import {ISnackBar} from "./ISnackBar";


declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

// CSS
import "../../style/snackbar.scss";


// HTML
const template = require( "../../templates/snackbar.html" );





export class SnackBar implements ISnackBar {

    static _instance: SnackBar = new SnackBar();
    private container: HTMLElement;



    constructor() {
        if ( ! SnackBar._instance ) {
            this.container      = document.createElement( "div" );
            this.container.id   = "snackbar-container";

            document.body.appendChild( this.container );
        } else {
            throw new Error( "Error: Instantiation failed! Use SnackBar.getInstance() instead of new." );
        }

        SnackBar._instance = this;
    }



    public show(type: SnackBarType, message: string): void {
        let snackbar        = document.createElement( "div" );
        snackbar.className  = "snackbar";

        snackbar.innerHTML  = template;

        snackbar.querySelector( ".snackbar-message" ).innerHTML = message;

        switch ( type ) {

            case SnackBarType.ERROR :

                snackbar.classList.add( "error" );

                break;

            case SnackBarType.ALERT :

                snackbar.classList.add( "alert" );

                break;

            case SnackBarType.INFO :

                snackbar.classList.add( "info" );

                break;

            case SnackBarType.SUCCESS :

                snackbar.classList.add( "success" );

                break;

            default :
                break;
        }


        snackbar.querySelector( ".snackbar-close" ).addEventListener( "click", () => {
            TweenLite.killTweensOf( snackbar );
            snackbar.parentNode.removeChild( snackbar );
        });


        this.container.appendChild( snackbar );


        TweenLite.to( snackbar, 0.5, {
            opacity: 1,
            marginTop: "2px",
            onComplete: () => {

                TweenLite.to( snackbar, 0.5, { delay: 2, opacity: 0, onComplete: () => {

                    snackbar.style.overflow = "hidden";

                    TweenLite.to( snackbar, 0.6, { height: 0, onComplete: () => {
                        snackbar.parentNode.removeChild( snackbar );
                    }})
                }});


            }
        });

    }



    public clear(): void {
        this.container.innerHTML = null;
    }

}
