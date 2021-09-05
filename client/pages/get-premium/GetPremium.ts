///<reference path="../../../node_modules/@types/node/globals.d.ts"/>

import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/get-premium.scss";



const template = require( "../../templates/get-premium.html" );





export class GetPremium extends Page {
    private header: Header;


    constructor() {
        super( "GetPremium", template );
        console.log( "GetPremium page script..." );

        this.header                 = new Header();


    }




}


window.onload = () => {
    new GetPremium();
};
