
import {SnackBarType} from "../snackbar/SnackBarType";
import {HTMLHelper} from "../../helpers/HTMLHelper";
import {View} from "../../core/View";

const template = require( "../../templates/share-modal.html" );





export class ShareModal extends View {
    private triggerBtn: HTMLElement;
    private container: HTMLElement;

    private closeBtn: HTMLElement;
    private shareURL: HTMLElement;
    private copyURL: HTMLElement;



    constructor(triggerBtn: HTMLElement) {
        super( "ShareModal" );

        this.triggerBtn             = triggerBtn;

        this.container              = document.createElement( "div" );

        this.container.id           = "share-design-modal";
        this.container.className    = "modal-overlay";

        this.container.innerHTML    = template;

        document.body.appendChild( this.container );

        this.closeBtn               = document.getElementById( "share-design-modal-close-btn" );
        this.shareURL               = document.getElementById( "share-url" );
        this.copyURL                = document.getElementById( "share-design-modal-copy-url" );

        this.shareURL.innerText     = window.location.href;

        this.registerEventListeners();
    }



    private registerEventListeners(): void {


        this.triggerBtn.addEventListener( "click", () => {

            this.container.style.display = "block";

        });


        this.closeBtn.addEventListener( "click", () => {

            this.container.style.display = "none";
        });


        this.copyURL.addEventListener( "click", () => {

            HTMLHelper.copyToClipboard( this.shareURL.innerText );

            this.snackback.show( SnackBarType.SUCCESS, "Successfully copied." );

        });

    }



}