
import {IPost} from "../models/interfaces/IPost";
import Elastic from "./ElasticSearch";



export class EventService {



    public static postDownloaded(post: IPost): void {

        if ( process.env.NODE_ENV !== "production" ) return;

        const {
            day,
            title,
            software,
            dominantColor,
            colors,
            slug
        } = post;

        Elastic.index({
            index: "uidd-post-downloaded",
            body: {
                date: new Date(),
                day,
                title,
                software,
                dominantColor,
                colors,
                url: `https://uidesigndaily.com/posts/${ slug }`
            }
        });
    }



    public static postSearch(searchTerm: string, software: string, tags: string[]): void {

        if ( process.env.NODE_ENV !== "production" ) return;

        if ( ! searchTerm && ! software && ( ! tags || ! tags.length ) ) return;

        Elastic.index({
            index: "uidd-post-search",
            body: {
                date: new Date(),
                searchTerm,
                software,
                tags
            }
        });
    }



    public static adClick(identifier: string, name: string, position: string, link: string): void {

        if ( process.env.NODE_ENV !== "production" ) return;

        Elastic.index({
            index: "uidd-ad-click",
            body: {
                date: new Date(),
                identifier,
                name,
                position,
                link
            }
        });
    }
}
