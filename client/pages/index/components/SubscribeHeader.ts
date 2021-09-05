
import {NotificationBanner} from "../../../common/notification-banner/NotificationBanner";
import {NotificationType} from "../../../common/notification-banner/NotificationType";
import {ValidationHelper} from "../../../helpers/ValidationHelper";
import {CookieHelper} from "../../../helpers/CookieHelper";
import {INotification} from "../../../core/INotification";
import {DateHelper} from "../../../helpers/DateHelper";
import {Notifications} from "../Notifications";
import {View} from "../../../core/View";



export class SubscribeHeader extends View {
    private container: HTMLElement;

    private dayCount: HTMLElement;

    private emailInput: HTMLInputElement;
    private emailError: HTMLElement;
    private subscribeBtn: HTMLElement;

    private isSubscribing: boolean;


    constructor() {
        super( "SubscribeHeader" );

        if ( CookieHelper.exists( "subscribed_to_uidesigndaily" ) ) return;

        this.container          = document.querySelector( ".sign-up-banner-container" ) as HTMLElement;

        this.container.style.display = "block";

        this.dayCount           = document.getElementById( "ui-day-count" );

        this.emailInput         = document.getElementById( "banner-subscribe-email-input" ) as HTMLInputElement;
        this.emailError         = document.getElementById( "banner-subscribe-email-error" );
        this.subscribeBtn       = document.getElementById( "banner-subscribe-btn" );

        this.subscribe          = this.subscribe.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.emailInput.addEventListener( "focus", () => this.emailError.style.opacity = '0' );

        this.emailInput.addEventListener( "keyup", (e: any) => {
            const key = e.which || e.keyCode;

            if ( key === 13 ) this.subscribe();
        });


        this.subscribeBtn.addEventListener( "click", this.subscribe );
    }



    private subscribe() {

        if ( this.isSubscribing ) return;

        if ( ! ValidationHelper.validateEmail( this.emailInput.value ) ) return this.emailError.style.opacity = '1';

        this.connection.subscribe( this.emailInput.value )
            .done( (response: any) => {
                console.log( response );

                this.sendNotification( Notifications.USER_SUBSCRIBED );

                this.isSubscribing = false;

                NotificationBanner._instance.show( NotificationType.SUCCESS, "Thank you for subscribing!", "You will receive an email to confirm your subscription." );
            })
            .fail( (err: Error) => {
                console.error( err );

                this.isSubscribing = false;

                NotificationBanner._instance.show( NotificationType.ERROR, "Oups! An error occurred.", "Please try again, or use the contact page to get in touch." );
            });
    }



    private initDayCounter() {
        const extraDays     = 1;

        const limit         = DateHelper.calculateUIDay() + extraDays;
        const pause         = 50;
        let day             = limit - 30;


        const interval = setInterval( () => {

            if ( day < limit ) {
                day++;

                this.dayCount.innerHTML = day.toString();
            } else {
                clearInterval( interval );
            }

        }, pause );

    }



    public listNotificationInterests(): any[] {
        let notifications = super.listNotificationInterests();

        notifications.push( Notifications.USER_SUBSCRIBED );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case Notifications.USER_SUBSCRIBED :

                console.log( "User subscribed notification received in subscribe header" );

                this.container.style.display = "none";

                break;


            default :
                break;
        }
    }



    private enterScene(): void {

        this.registerEventListeners();
        this.initDayCounter();
    }

}
