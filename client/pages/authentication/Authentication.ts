///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/athentication.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/athentication.html" );





export class Authentication extends Page {



    constructor() {
        super( "Authentication", template );
        console.log( "Authentication page script..." );
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Authentication();
};
