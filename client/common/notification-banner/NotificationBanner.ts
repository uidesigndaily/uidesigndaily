
import {INotificationBanner} from "./INotificationBanner";
import {NotificationType} from "./NotificationType";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;



const template = require( "../../templates/notification-banner.html" );




export class NotificationBanner implements INotificationBanner {

    static _instance: NotificationBanner = new NotificationBanner();
    private container: HTMLElement;



    constructor() {
        if ( ! NotificationBanner._instance ) {
            this.container      = document.createElement( "div" );
            this.container.id   = "notification-banner-container";

            document.body.appendChild( this.container );
        } else {
            throw new Error( "Error: Instantiation failed! Use NotificationBanner.getInstance() instead of new." );
        }

        NotificationBanner._instance = this;
    }



    public show(type: NotificationType, title: string, message: string): void {
        let notification        = document.createElement( "div" );
        notification.className  = "notification-banner";

        notification.innerHTML  = template;

        notification.querySelector( ".notification-title" ).innerHTML   = title;
        notification.querySelector( ".notification-message" ).innerHTML = message;

        switch ( type ) {

            case NotificationType.ERROR :

                notification.classList.add( "error" );

                break;

            case NotificationType.ALERT :

                notification.classList.add( "alert" );

                break;

            case NotificationType.INFO :

                notification.classList.add( "info" );

                break;

            case NotificationType.SUCCESS :

                notification.classList.add( "success" );

                break;

            default :
                break;
        }


        notification.querySelector( ".close-btn" ).addEventListener( "click", () => {
            TweenLite.killTweensOf( notification );
            notification.parentNode.removeChild( notification );
        });


        this.container.appendChild( notification );


        TweenLite.to( notification, 0.5, {
            opacity: 1,
            marginTop: "2px",
            onComplete: () => {

                TweenLite.to( notification, 0.5, { delay: 2, opacity: 0, onComplete: () => {

                    notification.style.overflow = "hidden";

                    TweenLite.to( notification, 0.6, { height: 0, onComplete: () => {
                        notification.parentNode.removeChild( notification );
                    }})
                }});
            }
        });

    }



    public clear(): void {
        this.container.innerHTML = null;
    }

}
