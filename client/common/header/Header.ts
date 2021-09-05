

const template = require( "../../templates/header.html" );

export class Header {

    private container: HTMLElement;

    private itemDesigns: HTMLElement;
    private itemAbout: HTMLElement;
    private itemLicense: HTMLElement;
    private itemContact: HTMLElement;

    private mobileMenuBtn: HTMLElement;
    private mobileMenu: HTMLElement;
    private mobileMenuCloseBtn: HTMLElement;

    private itemMobileDesigns: HTMLElement;
    private itemMobileAbout: HTMLElement;
    private itemMobileLicense: HTMLElement;
    private itemMobileContact: HTMLElement;
    private itemMobileTerms: HTMLElement;
    private itemMobilePrivate: HTMLElement;



    constructor() {

        this.container              = document.getElementById( "header-container" );
        this.container.innerHTML    = template;


        this.mobileMenuBtn          = document.getElementById( "main-nav-open-menu-btn" );
        this.mobileMenu             = document.getElementById( "mobile-menu-container" );
        this.mobileMenuCloseBtn     = document.getElementById( "mobile-close-menu-btn" );

        this.itemDesigns            = document.getElementById( "main-nav-designs-btn" );
        this.itemAbout              = document.getElementById( "main-nav-about-btn" );
        this.itemLicense            = document.getElementById( "main-nav-license-btn" );
        this.itemContact            = document.getElementById( "main-nav-contact-btn" );

        this.itemMobileDesigns      = document.getElementById( "mobile-main-nav-designs-btn" );
        this.itemMobileAbout        = document.getElementById( "mobile-main-nav-about-btn" );
        this.itemMobileLicense      = document.getElementById( "mobile-main-nav-license-btn" );
        this.itemMobileContact      = document.getElementById( "mobile-main-nav-contact-btn" );
        this.itemMobileTerms        = document.getElementById( "mobile-main-nav-terms-btn" );
        this.itemMobilePrivate      = document.getElementById( "mobile-main-nav-privacy-btn" );

        this.registerEventListeners();

        this.setActiveMenuItem();
    }



    private registerEventListeners(): void {
        this.mobileMenuBtn.addEventListener( "click", () => this.mobileMenu.style.display = "block" );
        this.mobileMenuCloseBtn.addEventListener( "click", () => this.mobileMenu.style.display = "none" );
    }



    private setActiveMenuItem(): void {

        const url = window.location.pathname;

        if ( url === '/' ) {

            this.itemDesigns.classList.add( "active" );
            this.itemMobileDesigns.classList.add( "active" );

        } else if ( url.substr( -"about".length ) === "about" ) {

            this.itemAbout.classList.add( "active" );
            this.itemMobileAbout.classList.add( "active" );

        } else if ( url.substr( -"license".length ) === "license" ) {

            this.itemLicense.classList.add( "active" );
            this.itemMobileLicense.classList.add( "active" );

        } else if ( url.substr( -"contact".length ) === "contact" ) {

            this.itemContact.classList.add( "active" );
            this.itemMobileContact.classList.add( "active" );

        } else if ( url.substr( -"terms".length ) === "terms" ) {

            this.itemMobileTerms.classList.add( "active" );

        } else if ( url.substr( -"privacy".length ) === "privacy" ) {

            this.itemMobilePrivate.classList.add( "active" );
        }

    }


}