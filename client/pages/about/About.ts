///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/about.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/about.html" );





export class About extends Page {
    private header: Header;


    constructor() {
        super( "About", template );
        console.log( "About page script..." );

        this.header = new Header();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new About();
};
