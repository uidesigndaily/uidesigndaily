///<reference path="../../../node_modules/@types/node/globals.d.ts"/>


import {ContactForm} from "./components/ContactForm";
import {Header} from "../../common/header/Header";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/contact.scss";



declare const TimelineLite: any;
declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require( "../../templates/contact.html" );





export class Contact extends Page {
    private header: Header;
    private form: ContactForm;


    constructor() {
        super( "Contact", template );
        console.log( "Contact page script..." );

        this.header = new Header();
        this.form   = new ContactForm();
    }



    private registerEventListeners () {}

}


window.onload = () => {
    new Contact();
};
