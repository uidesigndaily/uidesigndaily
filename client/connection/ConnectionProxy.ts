
import {AdImagePosition} from "../common/ads/constants/AdImagePosition";
import {PostSearchModel} from "./models/PostSearchModel";
import {ContactModel} from "./models/ContactModel";
import {Proxy} from "../core/Proxy";





export class ConnectionProxy extends Proxy {

    constructor() {
        let address = `${ location.protocol }//${ location.hostname }${ location.port ? ':' + location.port: '' }`;
        super(  address );
    }



    public contact(data: ContactModel) {

        return this.httpRequest(
            "POST",
            "/api/v1/contact",
            data
        );
    }



    public searchPosts(data: PostSearchModel) {

        return this.httpRequest(
            "POST",
            "/api/v1/posts/search",
            data
        );
    }



    public downloadedPost(id: string) {

        return this.httpRequest(
            "PUT",
            `/api/v1/posts/downloaded/${ id }`
        );
    }



    public subscribe(email: string) {

        return this.httpRequest(
            "POST",
            "/api/v1/subscriptions/subscribe",
            { email }
        );
    }



    public dismissCookieNotification() {

        return this.httpRequest(
            "GET",
            "/api/v1/cookies/dismiss"
        );
    }



    public getTags() {

        return this.httpRequest(
            "GET",
            "/api/v1/globals/tags"
        );
    }



    public getSoftware() {

        return this.httpRequest(
            "GET",
            "/api/v1/globals/software"
        );
    }



    public getAds() {

        return this.httpRequest(
            "GET",
            "/api/v1/sup"
        );
    }



    public sendAdImpressions(data: any) {

        return this.httpRequest(
            "PUT",
            "/api/v1/sup/impressions",
            data
        );
    }



    public registerAdClick(id: string, position: AdImagePosition) {

        return this.httpRequest(
            "PUT",
            "/api/v1/sup/click",
            { id, position }
        );
    }



    public slackInvite(email: string) {

        return this.httpRequest(
            "POST",
            "/api/v1/subscriptions/slack-invite",
            { email }
        );
    }
}
