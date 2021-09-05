

import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/index.scss";
import "../../style/404.scss";


const template = require( "../../templates/404.html" );


export class NotFound extends Page {




    constructor() {
        super( "NotFound", template );
        console.log( "NotFound page script..." );

    }




}





window.onload = () => {
    new NotFound();
};
