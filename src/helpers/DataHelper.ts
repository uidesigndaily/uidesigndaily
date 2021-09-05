
import {AdImagePosition} from "../models/constants/AdImagePosition";




export class DataHelper {



    public static getAdPositionReadable(position: number): string {

        position = parseInt( position as any );

        switch ( position ) {

            case AdImagePosition.GALLERY_BANNER :
                return "Gallery Banner";

            case AdImagePosition.GALLERY_CARD :
                return "Gallery Card";

            case AdImagePosition.POST :
                return "Post";
        }


        return "Unknown";
    }

}
