
import {View} from "../../../core/View";
import {Filter} from "./Filter";


declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

declare const SimpleBar: any;


export class TagsFilter extends View {
    private parent: Filter;

    private container: HTMLElement;

    private closeBtn: HTMLElement;
    private clearBtn: HTMLElement;

    private tagCountLabel: HTMLElement;

    private tagsMainWrapper: HTMLElement;
    private tagsWrapper: HTMLElement;

    private tags: string[];



    constructor(parent: Filter) {
        super( "TagsFilter" );

        this.parent             = parent;

        this.tags               = [];

        this.container          = document.getElementById( "tag-filter-panel" );

        this.closeBtn           = document.getElementById( "tag-filter-panel-close-btn" );
        this.clearBtn           = document.getElementById( "tag-clear-btn" );

        this.tagCountLabel      = document.getElementById( "tag-counter-label" );

        this.tagsMainWrapper    = document.getElementById( "tags-content-wrapper" );

        new SimpleBar( this.tagsMainWrapper );

        this.tagsWrapper        = this.tagsMainWrapper.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;

        this.closeListener          = this.closeListener.bind( this );
        this.updateTagCount         = this.updateTagCount.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );
        this.clearListener          = this.clearListener.bind( this );

        this.populate();
    }



    private registerEventListeners(): void {
        this.closeBtn.addEventListener( "click", this.closeListener );
        this.clearBtn.addEventListener( "click", this.clearListener );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.closeBtn.removeEventListener( "click", this.closeListener );
        this.clearBtn.removeEventListener( "click", this.clearListener );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.exitScene(); // ESCAPE
    }



    private clearListener(): void {
        this.tags = [];

        let tags = this.tagsWrapper.getElementsByClassName( "tag" );

        for ( let i = 0; i < tags.length; i++ ) {
            tags[i].classList.remove( "active" );
        }

        this.updateTagCount();

        this.parent.filterPosts();
    }



    private closeListener(): void {
        this.exitScene();
    }



    private populate(): void {

        this.connection.getTags()
            .done( (tags: string[]) => {

                this.tagsWrapper.innerHTML = '';

                tags = tags.sort();

                let section = '';

                for ( let tag of tags ) {

                    if ( section !== tag.charAt( 0 ) ) {

                        section = tag.charAt( 0 );

                        const container = document.createElement( "div" );
                        container.className = "tags-content";

                        const title = document.createElement( "h2" );
                        title.className = "grey bold";
                        title.innerText = section;

                        container.appendChild( title );
                        this.tagsWrapper.appendChild( container );
                    }

                    const item = document.createElement( "div" );
                    item.className = "tag noselect";
                    item.innerText = tag;


                    this.tagsWrapper.lastChild.appendChild( item );

                    item.addEventListener( "click", (e: any) => {

                        if ( e.target.classList.contains( "active" ) ) {
                            e.target.classList.remove( "active" );
                            this.tags = this.tags.filter( (t: string) => t !== e.target.innerText );
                        } else {
                            e.target.classList.add( "active" );
                            this.tags.push( e.target.innerText );
                        }

                        this.updateTagCount();

                        this.parent.filterPosts();
                    });

                }

            })
            .fail( (err: Error) => console.error( err ) );
    }



    public getTags(): string[] { return this.tags; }



    public updateTagCount(): void {

        if ( this.tags.length === 1 ) {
            this.tagCountLabel.innerHTML = `<span>${ this.tags.length }</span> tag selected`;
        } else {
            this.tagCountLabel.innerHTML = `<span>${ this.tags.length }</span> tags selected`;
        }

    }



    public enterScene(): void {
        this.registerEventListeners();
        TweenLite.to( this.container, 0.5, { right: 0 } );
    }



    public exitScene(): void {
        this.unregisterEventListeners();
        TweenLite.to( this.container, 0.5, { right: "-100%" } );
    }

}
