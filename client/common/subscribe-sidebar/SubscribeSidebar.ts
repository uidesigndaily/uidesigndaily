
import {NotificationBanner} from "../notification-banner/NotificationBanner";
import {NotificationType} from "../notification-banner/NotificationType";
import {ValidationHelper} from "../../helpers/ValidationHelper";
import {Notifications} from "../../pages/index/Notifications";
import {CookieHelper} from "../../helpers/CookieHelper";
import {EventManager} from "../../core/EventManager";
import {View} from "../../core/View";

const template = require( "../../templates/subscribe-sidebar.html" );

declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;



export class SubscribeSidebar extends View {
    private mainContainer: HTMLElement;
    private container: HTMLElement;

    private panel: HTMLElement;
    private closeBtn: HTMLElement;
    private error: HTMLElement;
    private email: HTMLInputElement;
    private subscribeBtn: HTMLElement;
    private outerBtn: HTMLElement;

    private positionTimeOut: any;
    private subscribeTimer: any;



    constructor() {
        super( "SubscribeSidebar" );

        if ( CookieHelper.exists( "subscribed_to_uidesigndaily" ) ) return;

        this.mainContainer          = document.getElementById( "main-container" );

        this.container              = document.createElement( "div" );
        this.container.className    = "subscribe-widget-main-container";

        this.container.innerHTML    = template;

        document.body.appendChild( this.container );

        this.panel                  = document.getElementById( "subscribe-widget-panel" );
        this.closeBtn               = document.getElementById( "subscribe-widget-panel-close-btn" );
        this.error                  = document.getElementById( "subscribe-widget-error-message" );
        this.email                  = document.getElementById( "subscribe-widget-email-input" ) as HTMLInputElement;
        this.subscribeBtn           = document.getElementById( "subscribe-widget-subscribe-btn" );
        this.outerBtn               = document.getElementById( "subscribe-widget-outer-subscribe-btn" );

        this.exitScene              = this.exitScene.bind( this );
        this.enterScene             = this.enterScene.bind( this );
        this.positionOuterBtn       = this.positionOuterBtn.bind( this );
        this.subscribeListener      = this.subscribeListener.bind( this );

        this.positionOuterBtn();
        this.initSubscribeTimeout();
        this.registerEventListeners();
    }



    private registerEventListeners(): void {
        this.closeBtn.addEventListener( "click", () => this.exitScene() );
        this.outerBtn.addEventListener( "click", () => this.enterScene() );
        this.email.addEventListener( "focus", () => this.error.style.opacity = "0" );
        this.subscribeBtn.addEventListener( "click", this.subscribeListener );
        window.addEventListener( "scroll", this.positionOuterBtn );
        window.addEventListener('resize', this.positionOuterBtn );
    }



    private subscribeListener() {

        const email = this.email.value;

        if ( ! ValidationHelper.validateEmail( email ) ) {
            return this.error.style.opacity = "1";
        }

        this.connection.subscribe( email )
            .done( (response: any) => {
                console.log( response );

                EventManager._instance.sendNotification( Notifications.USER_SUBSCRIBED );

                NotificationBanner._instance.show( NotificationType.SUCCESS, "Thank you for subscribing!", "You will receive an email to confirm your subscription." );

            })
            .fail( (err: Error) => {

                console.error( err );

                NotificationBanner._instance.show( NotificationType.ERROR, "Oups! An error occurred.", "Please try again, or use the contact page to get in touch." );
            });

        this.exitScene( true );
    }



    private positionOuterBtn(): void {

        if ( this.positionTimeOut ) clearTimeout( this.positionTimeOut );

        if ( ! document.scrollingElement ) return;

        this.positionTimeOut = setTimeout( () => {

            const isScrollbarVisible = document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight > 0;
            const isScrolledToBottom = document.scrollingElement.scrollHeight - document.scrollingElement.scrollTop === document.scrollingElement.clientHeight;

            if ( ! isScrollbarVisible || isScrollbarVisible && isScrolledToBottom  ) {
                this.outerBtn.classList.add( "compensate" );
            } else {
                this.outerBtn.classList.remove( "compensate" );
            }

        }, 200 );
    }



    private initSubscribeTimeout(): void {

        this.subscribeTimer = setTimeout( () => {

            this.panel.style.display = "block";

            TweenLite.to( this.outerBtn, 0.2, { opacity: 0, onComplete: () => this.outerBtn.style.display = "none" } );
            TweenLite.to( this.panel, 0.2, { delay: 0.2, opacity: 1, marginRight: 0 } );

        }, 12000 );
    }



    private enterScene(): void {

        if ( this.subscribeTimer ) clearTimeout( this.subscribeTimer );

        this.panel.style.display = "block";

        TweenLite.to( this.outerBtn, 0.2, { opacity: 0, onComplete: () => this.outerBtn.style.display = "none" } );
        TweenLite.to( this.panel, 0.2, { delay: 0.2, opacity: 1, marginRight: 0 } );
    }



    private exitScene(permanent?: boolean): void {

        TweenLite.to( this.panel, 0.2, { opacity: 0, marginRight: "-25px", onComplete: () => {

            if ( permanent ) return;

            this.outerBtn.style.display = "block";
            this.panel.style.display = "none";

            TweenLite.to( this.outerBtn, 0.2, { opacity: 1 } );
        }});
    }
}
