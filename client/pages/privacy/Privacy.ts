///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/privacy.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/privacy.html" );





export class Privacy extends Page {
    private header: Header;


    constructor() {
        super( "Privacy", template );
        console.log( "Privacy page script..." );

        this.header = new Header();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Privacy();
};
