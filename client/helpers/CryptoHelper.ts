


export class CryptoHelper {

    public static uuidv4 () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        });
    }


    public static uniqueId () {
        return Math.random().toString( 36 ).substring( 2 ) + ( new Date() ).getTime().toString( 36 );
    }

}
