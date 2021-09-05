
import {PostSearchModel} from "../../../connection/models/PostSearchModel";
import {INotification} from "../../../core/INotification";
import {PostFilterModel} from "../models/PostFilterModel";
import {HTMLHelper} from "../../../helpers/HTMLHelper";
import {AdFactory} from "../../../common/ads/AdFactory";
import {AdType} from "../../../common/ads/AdType";
import {Notifications} from "../Notifications";
import {View} from "../../../core/View";
import {Thumbnail} from "./Thumbnail";





export class Listing extends View {
    private container: HTMLElement;
    private emptyState: HTMLElement;
    private emptyStateKeyword: HTMLElement;

    private postBatch: number;

    private adFrequency: number;

    private loadingPosts: boolean;
    private loadedAllPosts: boolean;

    private filter: PostFilterModel;



    constructor() {
        super( "Listing" );

        this.container          = document.getElementById( "post-listing" );

        this.emptyState         = document.getElementById( "search-result-empty-state" );
        this.emptyStateKeyword  = document.getElementById( "search-empty-state-keyword" );

        this.postBatch          = 0;
        this.adFrequency        = 24;

        this.filter             = new PostFilterModel( null, null, null );

        this.enterScene();
    }



    private registerEventListeners(): void {

        window.addEventListener( "scroll", () => {

            if ( HTMLHelper.getScrollPercentage() > 60 ) {

                if ( this.loadedAllPosts ) return;

                if ( this.loadingPosts ) return;

                this.loadingPosts = true;

                this.connection.searchPosts( new PostSearchModel(
                    ++this.postBatch,
                    50,
                    this.filter.substring,
                    this.filter.software,
                    this.filter.tags
                ))
                    .done( (posts: any) => {

                        if ( ! posts.length ) this.loadedAllPosts = true;

                        this.renderPosts( posts );

                        this.loadingPosts = false;
                    })
                    .fail( (err: Error) => {
                        console.error( err );
                        this.loadingPosts = false;
                    });
            }
        });
    }



    private populate(): void {

        this.connection.searchPosts( new PostSearchModel(
            this.postBatch,
            50,
            null,
            null,
            null
        ))
            .done( (posts: any) => {

                if ( ! posts.length ) {
                    this.emptyState.style.display = "block";
                } else {
                    this.emptyState.style.display = "none";
                }


                this.renderPosts( posts );

            })
            .fail( (err: Error) => console.error( err ) );
    }



    private resetPostLoadingFlags(): void {
        this.postBatch          = 0;
        this.loadedAllPosts     = false;
        this.loadingPosts       = false;
    }



    private filterPosts(filter: PostFilterModel): void {

        this.resetPostLoadingFlags();

        this.filter = filter;

        this.connection.searchPosts( new PostSearchModel(
            this.postBatch,
            50,
            filter.substring,
            filter.software,
            filter.tags
        ))
            .done( (posts: any) => {

                this.container.innerHTML = '';

                if ( ! posts.length ) {
                    this.emptyState.style.display       = "block";
                    this.emptyStateKeyword.innerText    = filter.substring;
                } else {
                    this.emptyState.style.display = "none";
                }

                this.renderPosts( posts );

            })
            .fail( (err: Error) => console.error( err ) );
    }



    private renderPosts(posts: any[]): void {

        for ( let i = 0, j = 0; i < posts.length; i++, j++ ) {

            if ( i % 30 === 0 ) {

                if ( AdFactory.getAd( AdType.GALLERY_CARD ) ) j++;
            }

            new Thumbnail( this.container, posts[i] );

            /** Every Nth item is a subscribe banner */
            if ( j > 0 && (j + 1) % this.adFrequency === 0 ) AdFactory.getAd( AdType.GALLERY_BANNER );
        }

    }



    public listNotificationInterests(): any[] {
        let notifications = super.listNotificationInterests();

        notifications.push( Notifications.FILTER_POSTS );
        notifications.push( Notifications.USER_SUBSCRIBED );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case Notifications.FILTER_POSTS :

                this.filterPosts( notification.data );

                break;


            default :
                break;
        }
    }



    private enterScene(): void {
        this.registerEventListeners();
        this.populate();
    }
}
