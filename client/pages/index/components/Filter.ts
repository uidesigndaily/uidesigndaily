
import {CookieHelper} from "../../../helpers/CookieHelper";
import {PostFilterModel} from "../models/PostFilterModel";
import {INotification} from "../../../core/INotification";
import {Notifications} from "../Notifications";
import {View} from "../../../core/View";
import {TagsFilter} from "./TagsFilter";





export class Filter extends View {
    private container: HTMLElement;

    private searchInput: HTMLInputElement;
    private clearSearch: HTMLElement;

    private softwareAll: HTMLElement;
    private softwareSketch: HTMLElement;
    private softwarePhotoshop: HTMLElement;
    private softwarePrinciple: HTMLElement;
    private softwareFigma: HTMLElement;
    private softwareXd: HTMLElement;
    private softwareStudio: HTMLElement;

    private tagsFilterBtn: HTMLElement;
    private tagsFilterCount: HTMLElement;

    private tagsFilter: TagsFilter;

    private softwareSelected: string;

    private searchTimer: any;



    constructor() {
        super( "Filter" );

        this.tagsFilter             = new TagsFilter( this );

        this.softwareSelected       = null;

        this.container              = document.querySelector( ".filter-section" ) as HTMLElement;

        this.searchInput            = document.getElementById( "post-search-input" ) as HTMLInputElement;
        this.clearSearch            = document.getElementById( "clear-search-btn" );

        this.softwareAll            = document.getElementById( "post-software-filter-all" );
        this.softwareSketch         = document.getElementById( "post-software-filter-sketch" );
        this.softwarePhotoshop      = document.getElementById( "post-software-filter-photoshop" );
        this.softwarePrinciple      = document.getElementById( "post-software-filter-principle" );
        this.softwareFigma          = document.getElementById( "post-software-filter-figma" );
        this.softwareXd             = document.getElementById( "post-software-filter-xd" );
        this.softwareStudio         = document.getElementById( "post-software-filter-studio" );

        this.tagsFilterBtn          = document.getElementById( "post-tags-filter-btn" );
        this.tagsFilterCount        = document.getElementById( "post-tags-filter-count" );

        if ( ! CookieHelper.exists( "subscribed_to_uidesigndaily" ) ) this.container.classList.remove( "extra-margin" );

        this.searchListener         = this.searchListener.bind( this );
        this.filterPosts            = this.filterPosts.bind( this );

        this.registerEventListeners();
    }



    private registerEventListeners(): void {

        this.searchInput.addEventListener( "keyup", this.searchListener );

        this.softwareAll.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwareAll.classList.add( "active" );
            this.softwareSelected = null;
            this.filterPosts();
        });

        this.softwareSketch.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwareSketch.classList.add( "active" );
            this.softwareSelected = "sketch";
            this.filterPosts();
        });

        this.softwarePhotoshop.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwarePhotoshop.classList.add( "active" );
            this.softwareSelected = "photoshop";
            this.filterPosts();
        });

        this.softwarePrinciple.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwarePrinciple.classList.add( "active" );
            this.softwareSelected = "principle";
            this.filterPosts();
        });

        this.softwareFigma.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwareFigma.classList.add( "active" );
            this.softwareSelected = "figma";
            this.filterPosts();
        });

        this.softwareXd.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwareXd.classList.add( "active" );
            this.softwareSelected = "xd";
            this.filterPosts();
        });

        this.softwareStudio.addEventListener( "click", () => {
            this.clearSoftwareSelection();
            this.softwareStudio.classList.add( "active" );
            this.softwareSelected = "studio";
            this.filterPosts();
        });

        this.tagsFilterBtn.addEventListener( "click", () => {
            this.tagsFilter.enterScene();
        });

        this.clearSearch.addEventListener( "click", () => {
            this.clearSearch.style.display  = "none";
            this.searchInput.value          = '';
            this.filterPosts();
        });
    }



    private clearSoftwareSelection(): void {

        let softwareFilters = document.getElementsByClassName( "software-item" );

        for ( let i = 0; i < softwareFilters.length; i++ ) {
            softwareFilters[ i ].classList.remove( "active" );
        }
    }



    private searchListener(e: any): void {

        if ( this.searchInput.value.length ) {
            this.clearSearch.style.display = "block";
        } else {
            this.clearSearch.style.display = "none";
        }

        if ( this.searchTimer ) clearTimeout( this.searchTimer );

        this.searchTimer = setTimeout(
            this.filterPosts,
            250
        );
    }



    private displayTagCount(tags: string[]): void {

        if ( ! tags.length ) {
            this.tagsFilterCount.style.display  = "none";
        } else {
            this.tagsFilterCount.innerText      = tags.length.toString();
            this.tagsFilterCount.style.display  = "block";
        }
    }



    public filterPosts(): void {

        const tagsFilter = this.tagsFilter.getTags();

        this.displayTagCount( tagsFilter );

        this.sendNotification( Notifications.FILTER_POSTS, new PostFilterModel(
            this.searchInput.value,
            this.softwareSelected,
            tagsFilter
        ));
    }



    public listNotificationInterests(): any[] {
        let notifications = super.listNotificationInterests();

        notifications.push( Notifications.USER_SUBSCRIBED );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case Notifications.USER_SUBSCRIBED :

                this.container.classList.add( "extra-margin" );

                break;


            default :
                break;
        }
    }

}
