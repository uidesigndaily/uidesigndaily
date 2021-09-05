

declare const $: any;


export class Proxy {
    protected address: string;
    protected static token: string;
    protected static tokenExpires: Date;





    constructor(address: string) {
        this.address = address;
    }



    protected setToken(tokenData: any): void {
        if ( ! tokenData ) {
            console.warn( "Invalid token data provided!" );
            return;
        }

        Proxy.token         = tokenData.token;
        Proxy.tokenExpires  = tokenData.expires;

    }



    protected httpRequest(method: string, endpoint: string, data?: any) {

        return $.ajax({
            method,
            url: this.address + endpoint,
            data
        });
    }

}
