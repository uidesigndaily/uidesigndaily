///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/upload.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/upload.html" );





export class Upload extends Page {



    constructor() {
        super( "Upload", template );
        console.log( "Upload page script..." );
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Upload();
};
