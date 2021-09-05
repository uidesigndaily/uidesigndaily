///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/license.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/license.html" );





export class License extends Page {
    private header: Header;


    constructor() {
        super( "License", template );
        console.log( "License page script..." );

        this.header = new Header();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new License();
};
