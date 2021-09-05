///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {SubscribeHeader} from "./components/SubscribeHeader";
import {Header} from "../../common/header/Header";
import {Listing} from "./components/Listing";
import {Filter} from "./components/Filter";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/index.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/index.html" );





export class Index extends Page {
    private header: Header;
    private subscribeHeader: SubscribeHeader;
    private filter: Filter;
    private listing: Listing;

    constructor() {
        super( "Index", template );
        console.log( "Index page script..." );

        this.header             = new Header();
        this.subscribeHeader    = new SubscribeHeader();
        this.filter             = new Filter();
        this.listing            = new Listing();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Index();
};
