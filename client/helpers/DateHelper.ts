


export class DateHelper {


    public static getParsedDate(dateISO: string): string {

        const date  = new Date( dateISO );
        const year  = date.getFullYear();
        const day   = date.getDate();
        const month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ][ date.getMonth() ];

        return `${ day } ${ month } ${ year }`;
    }



    public static sortByDateProp(arr: any[], dateProp: string, descending?: boolean): any[] {
        let sorted = arr.sort((a: any, b: any) => {
            return new Date( a[ dateProp ] ).valueOf() - new Date( b[ dateProp ]).valueOf();
        });

        if ( descending ) {
            return sorted.reverse();
        } else {
            return sorted;
        }
    }



    public static calculateUIDay(): number {
        let day         = 750;
        const date      = new Date( 2019, 0, 22 );
        const today     = new Date();

        day += DateHelper.workingDaysBetweenDates( date, today );

        return day;
    }



    public static workingDaysBetweenDates(startDate: any, endDate: any) {

        // Validate input
        if ( endDate < startDate ) return 0;

        // Calculate days between dates
        let millisecondsPerDay = 86400 * 1000; // Day in milliseconds

        startDate.setHours( 0,0,0,1 );  // Start just after midnight
        endDate.setHours( 23,59,59,999 );  // End just before midnight

        let diff = endDate - startDate;  // Milliseconds between datetime objects
        let days = Math.ceil( diff / millisecondsPerDay );

        // Subtract two weekend days for every week in between
        let weeks = Math.floor( days / 7 );
        days = days - ( weeks * 2 );

        // Handle special cases
        let startDay = startDate.getDay();
        let endDay = endDate.getDay();

        // Remove weekend not previously removed.
        if ( startDay - endDay > 1 ) days -= 2;


        // Remove start day if span starts on Sunday but ends before Saturday
        if ( startDay == 0 && endDay != 6 ) days -= 1;

        // Remove end day if span ends on Saturday but starts after Sunday
        if ( endDay == 6 && startDay != 0 ) days -= 1;

        return days;
    }
}