
import {ContactModel} from "../../../connection/models/ContactModel";
import {ValidationHelper} from "../../../helpers/ValidationHelper";
import {View} from "../../../core/View";





export class ContactForm extends View {

    private name: HTMLInputElement;
    private nameError: HTMLElement;

    private email: HTMLInputElement;
    private emailError: HTMLElement;

    private subject: HTMLInputElement;
    private subjectError: HTMLElement;

    private message: HTMLInputElement;
    private messageError: HTMLElement;

    private sendBtn: HTMLElement;

    private formContainer: HTMLElement;
    private feedbackContainer: HTMLElement;
    private tryAgainBtn: HTMLElement;



    constructor() {
        super( "ContactForm" );

        this.name               = document.getElementById( "contact-name-input" ) as HTMLInputElement;
        this.nameError          = document.getElementById( "contact-name-input-error" );

        this.email              = document.getElementById( "contact-email-input" ) as HTMLInputElement;
        this.emailError         = document.getElementById( "contact-email-input-error" );

        this.subject            = document.getElementById( "contact-subject-input" ) as HTMLInputElement;
        this.subjectError       = document.getElementById( "contact-subject-input-error" );

        this.message            = document.getElementById( "contact-message-input" ) as HTMLInputElement;
        this.messageError       = document.getElementById( "contact-message-input-error" );

        this.sendBtn            = document.getElementById( "contact-send-btn" );

        this.formContainer      = document.getElementById( "contact-form-container" );
        this.feedbackContainer  = document.getElementById( "contact-feedback-container" );
        this.tryAgainBtn        = document.getElementById( "contact-subscribe-try-again" );


        this.registerEventListeners();
    }



    private registerEventListeners(): void {

        this.sendBtn.addEventListener( "click", () => {

            if ( ! this.validateInputs() ) return;

            this.connection.contact(
                new ContactModel(
                    this.name.value,
                    this.email.value,
                    this.subject.value,
                    this.message.value
                )
            )
                .done( () => {
                    this.formContainer.style.display        = "none";
                    this.feedbackContainer.style.display    = "block";
                })
                .fail( () => {
                    this.formContainer.style.display = "none";

                    this.feedbackContainer.classList.add( "error" );
                    this.feedbackContainer.style.display = "block";
                });


        });

        this.name.addEventListener( "focus", () => this.nameError.style.opacity = '0' );
        this.email.addEventListener( "focus", () => this.emailError.style.opacity = '0' );
        this.subject.addEventListener( "focus", () => this.subjectError.style.opacity = '0' );
        this.message.addEventListener( "focus", () => this.messageError.style.opacity = '0' );


        this.tryAgainBtn.addEventListener( "click", () => {

            this.feedbackContainer.style.display    = "none";
            this.formContainer.style.display        = "block";

            this.formContainer.classList.remove( "error" );
        });
    }



    private validateInputs(): boolean {

        let isValid = true;

        if ( ! this.name.value ) {
            this.nameError.style.opacity = '1';
            isValid = false;
        }

        if ( ! ValidationHelper.validateEmail( this.email.value ) ) {
            this.emailError.style.opacity = '1';
            isValid = false;
        }

        if ( ! this.subject.value ) {
            this.subjectError.style.opacity = '1';
            isValid = false;
        }

        if ( ! this.message.value ) {
            this.messageError.style.opacity = '1';
            isValid = false;
        }

        return isValid;
    }


}
