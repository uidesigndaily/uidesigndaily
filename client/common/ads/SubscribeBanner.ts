
import {NotificationBanner} from "../notification-banner/NotificationBanner";
import {NotificationType} from "../notification-banner/NotificationType";
import {ValidationHelper} from "../../helpers/ValidationHelper";
import {Notifications} from "../../pages/index/Notifications";
import {CryptoHelper} from "../../helpers/CryptoHelper";
import {INotification} from "../../core/INotification";
import {EventManager} from "../../core/EventManager";
import {CoreEntity} from "../../core/CoreEntity";

const template = require( "../../templates/subscribe-banner.html" );





export class SubscribeBanner extends CoreEntity {
    private parent: HTMLElement;
    private container: HTMLElement;

    private emailInput: HTMLInputElement;
    private emailError: HTMLElement;
    private subscribeBtn: HTMLElement;

    private isSubscribing: boolean;



    constructor() {
        super( `SubscribeBanner@${ CryptoHelper.uniqueId() }` );

        this.parent                 = document.getElementById( "post-listing" );

        this.container              = document.createElement( "div" );
        this.container.className    = "inline-subscribe-banner-main-container";

        this.container.innerHTML    = template;

        this.emailInput         = this.container.querySelector( ".inline-banner-subscribe-email-input" ) as HTMLInputElement;
        this.emailError         = this.container.querySelector( ".subscribe-error-message" ) as HTMLElement;
        this.subscribeBtn       = this.container.querySelector( ".inline-banner-subscribe-btn" ) as HTMLElement;

        this.parent.appendChild( this.container );

        this.emailFocusListener     = this.emailFocusListener.bind( this );
        this.subscribe              = this.subscribe.bind( this );
        this.inputKeyUpListener     = this.inputKeyUpListener.bind( this );

        this.registerEventListeners();

    }



    private registerEventListeners(): void {
        this.emailInput.addEventListener( "focus", this.emailFocusListener );
        this.emailInput.addEventListener( "keyup", this.inputKeyUpListener );
        this.subscribeBtn.addEventListener( "click", this.subscribe );
    }



    private unregisterEventListeners(): void {
        this.emailInput.removeEventListener( "focus", this.emailFocusListener );
        this.emailInput.removeEventListener( "keyup", this.inputKeyUpListener );
        this.subscribeBtn.removeEventListener( "click", this.subscribe );
    }



    private inputKeyUpListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 13 ) this.subscribe();
    }



    private emailFocusListener(): void {
        this.emailError.style.opacity = '0'
    }



    private subscribe(): any {

        if ( this.isSubscribing ) return;

        if ( ! ValidationHelper.validateEmail( this.emailInput.value ) ) return this.emailError.style.opacity = '1';

        this.connection.subscribe( this.emailInput.value )
            .done( (response: any) => {

                console.log( response );

                EventManager._instance.sendNotification( Notifications.USER_SUBSCRIBED );

                this.isSubscribing = false;

                NotificationBanner._instance.show( NotificationType.SUCCESS, "Thank you for subscribing!", "You will receive an email to confirm your subscription." );

            })
            .fail( (err: Error) => {

                console.error( err );

                this.isSubscribing = false;

                NotificationBanner._instance.show( NotificationType.ERROR, "Oups! An error occurred.", "Please try again, or use the contact page to get in touch." );
            });
    }




    public exitScene(): void {
        this.unregister();
        this.unregisterEventListeners();
        if ( this.container.parentNode ) this.container.parentNode.removeChild( this.container );
    }



    public listNotificationInterests(): any[] {
        let notifications = super.listNotificationInterests();

        notifications.push( Notifications.USER_SUBSCRIBED );
        notifications.push( Notifications.FILTER_POSTS );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case Notifications.USER_SUBSCRIBED :
            case Notifications.FILTER_POSTS :

                this.exitScene();

                break;


            default :
                break;
        }
    }
}
