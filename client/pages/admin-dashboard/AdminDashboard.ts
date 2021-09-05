///<reference path="../../../node_modules/@types/node/globals.d.ts"/>

import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/admin-dashboard.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/admin-dashboard.html" );





export class AdminDashboard extends Page {


    constructor() {
        super( "AdminDashboard", template );
        console.log( "AdminDashboard page script..." );

    }



    private registerEventListeners () {}

}


window.onload = () => {
    new AdminDashboard();
};
