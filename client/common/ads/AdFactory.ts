
import {ConnectionProxy} from "../../connection/ConnectionProxy";
import {OperationsHelper} from "../../helpers/OperationsHelper";
import {CookieHelper} from "../../helpers/CookieHelper";
import {SubscribeBanner} from "./SubscribeBanner";
import {GalleryBannerAd} from "./GalleryBannerAd";
import {GalleryCardAd} from "./GalleryCardAd";
import {AdType} from "./AdType";
import {PostAd} from "./PostAd";





export class AdFactory {

    static _instance: AdFactory = new AdFactory();

    private static ads: any[] = [];

    private static adIndex: number = 0;

    private connection: ConnectionProxy;

    private static impressions: any = {};

    private static adsLoaded: boolean = false;

    private static adRequestQueue: number[] = [];



    constructor() {

        if ( AdFactory._instance ) {
            throw new Error( "Error: Instantiation failed! Use AdFactory.getInstance() instead of new." );
        }

        this.connection = new ConnectionProxy();
        this.populate();

        AdFactory._instance = this;

        this.registerEventListeners();
    }



    private registerEventListeners(): void {

        window.addEventListener( "beforeunload", () => {
            if ( !!Object.keys( AdFactory.impressions ).length ) {
                this.connection.sendAdImpressions( AdFactory.impressions );
            }

            return null;
        });
    }



    private populate(): void {

        this.connection.getAds()
            .done( (ads: any[]) => {

                AdFactory.ads = this.weighedShuffleAds( ads );

                AdFactory.adsLoaded = true;

                for ( let type of AdFactory.adRequestQueue ) AdFactory.getAd( type );
            })
            .fail( (err: Error) => console.error( err ) );

    }



    private weighedShuffleAds(ads: any[]): any[] {

        let ids = [];

        for ( let item of ads ) {

            for ( let i = 0; i < item.priority; i++ ) ids.push( item._id );
        }

        ids = OperationsHelper.shuffleArray( ids );

        let shuffledAds = [];

        while ( ids.length > 0 ) {

            let id: string = ids[ Math.floor( Math.random() * ids.length ) ];

            if ( ! id ) {
                console.error( "Ad random id was undefined." );
                return ads;
            }

            for ( let ad of ads ) {
                if ( ad._id === id ) {
                    shuffledAds.push( ad );
                    break;
                }
            }

            ids = ids.filter( (i: string) => i !== id );
        }

        return shuffledAds;
    }



    private static getAdData(type: AdType): any {

        if ( AdFactory.adIndex >= AdFactory.ads.length ) AdFactory.adIndex = 0;

        const ad =  AdFactory.ads[ AdFactory.adIndex++ ];

        if ( ! ad ) return null;

        const image = ad.images.filter( (img: any) => img.position === type )[0];

        if ( ! image ) return null;

        return ad;
    }



    public static recordImpression(adId: string): void {

        if ( AdFactory.impressions[ adId ]  ) {
            AdFactory.impressions[ adId ]++;
        } else {
            AdFactory.impressions[ adId ] = 1;
        }
    }



    public static getAd(type: AdType, acceptAsync?: boolean): any {

        if ( ! AdFactory.adsLoaded && acceptAsync ) return AdFactory.adRequestQueue.push( type );

        const adData = this.getAdData( type );

        switch ( type ) {

            case AdType.POST :

                return adData ? new PostAd( adData ) : null;

                break;

            case AdType.GALLERY_BANNER :

                if ( CookieHelper.exists( "subscribed_to_uidesigndaily" ) ) {

                    return adData ? new GalleryBannerAd( adData ) : null;

                } else {

                    if ( ! adData ) return new SubscribeBanner();

                    const rand = Math.round( Math.random() );

                    if ( rand > 0 ) {
                        return new GalleryBannerAd( adData );
                    } else {
                        return new SubscribeBanner()
                    }

                }

            case AdType.GALLERY_CARD :

                return adData ? new GalleryCardAd( adData ) : null;
        }
    }
}
