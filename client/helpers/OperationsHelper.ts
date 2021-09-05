
declare const Promise: any;

export class OperationsHelper {



    /**
     * Sleep/Pause the process on a specific line for a period of time
     *
     * Usage (within async function):
     * example: await OperationsHelper.sleep( 1000 );
     *
     * @param {number} ms - milliseconds
     * @return {any}
     */
    public static sleep(ms: number): any {
        return new Promise( (resolve: any) => { setTimeout( resolve, ms ) } );
    }



    public static sortAlphanumericProp(arr: any[], prop: string, descending?: boolean): any[] {
        let sorted = arr.sort( (a: any, b: any) => {
            return a[ prop ].toLowerCase().localeCompare( b[ prop ].toLowerCase() );
        });

        if ( descending ) {
           return sorted.reverse();
        } else {
            return sorted;
        }
    }



    public static randomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * ( max - min + 1 ) + min );
    }



    public static shuffleArray(arr: any[]): any[] {
        let counter = arr.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }

        return arr;
    }
}
