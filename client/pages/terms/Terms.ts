///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/terms.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/terms.html" );





export class Terms extends Page {
    private header: Header;


    constructor() {
        super( "Terms", template );
        console.log( "Terms page script..." );

        this.header = new Header();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Terms();
};
