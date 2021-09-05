


export class CookieHelper {



    public static exists(cookieName: string): boolean {
        const cookie = document.cookie.match( new RegExp("^(?:.*;)?\\s*" + cookieName + "\\s*=\\s*([^;]+)(?:.*)?$") );

        return !!cookie;
    }
}