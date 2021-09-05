

import {ValidationHelper} from "../../helpers/ValidationHelper";
import {Page} from "../../core/Page";


import "../../style/style-resets.scss";
import "../../style/main.scss";
import "../../style/index.scss";
import "../../style/slack-invite.scss";
import {Header} from "../../common/header/Header";


const template = require( "../../templates/slack-invite.html" );


export class SlackInvite extends Page {
    private header: Header;

    private inviteContainer: HTMLElement;
    private inviteSuccessContainer: HTMLElement;
    private inviteFailureContainer: HTMLElement;


    private emailInput: HTMLInputElement;
    private emailError: HTMLElement;
    private submitBtn: HTMLElement;



    constructor() {
        super( "SlackInvite", template );
        console.log( "SlackInvite page script..." );

        this.header                     = new Header();

        this.inviteContainer            = document.getElementById( "slack-invite-container" );
        this.inviteSuccessContainer     = document.getElementById( "slack-invite-success-container" );
        this.inviteFailureContainer     = document.getElementById( "slack-invite-failure-container" );


        this.emailInput                 = this.inviteContainer.querySelector( "input" ) as HTMLInputElement;
        this.emailError                 = this.inviteContainer.querySelector( ".input-error-msg" ) as HTMLElement;
        this.submitBtn                  = this.inviteContainer.querySelector( "button" ) as HTMLElement;

        this.registerEventListeners();
    }



    private registerEventListeners(): void {


        this.submitBtn.addEventListener( "click", () => {

            const email = this.emailInput.value;

            if ( ! ValidationHelper.validateEmail( email ) ) return this.emailError.style.opacity = "1";

            this.connection.slackInvite( email )
                .done( () => {
                    this.inviteContainer.style.display          = "none";
                    this.inviteSuccessContainer.style.display   = "block";
                })
                .fail( (err: Error) => {

                    this.inviteContainer.style.display          = "none";
                    this.inviteFailureContainer.style.display   = "block";

                    console.error( err );
                })

        });


        this.emailInput.addEventListener( "focus", () => this.emailError.style.opacity = "0" );
    }

}





window.onload = () => {
    new SlackInvite();
};
