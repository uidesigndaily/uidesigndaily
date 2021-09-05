///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {SubscribeSidebar} from "../../common/subscribe-sidebar/SubscribeSidebar";
import {ShareModal} from "../../common/share/ShareModal";
import {PostDetails} from "./components/PostDetails";
import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/post.scss";




declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/post.html" );





export class Post extends Page {
    private header: Header;
    private subscribeSidebar: SubscribeSidebar;
    private details: PostDetails;
    private share: ShareModal;

    constructor() {
        super( "Post", template );
        console.log( "Post page script..." );

        this.header                 = new Header();
        this.subscribeSidebar       = new SubscribeSidebar();
        this.details                = new PostDetails( this );

        this.share                  = new ShareModal( document.getElementById( "post-details-share-btn" ) );

    }




}


window.onload = () => {
    new Post();
};
