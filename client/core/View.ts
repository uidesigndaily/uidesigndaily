

import {CoreEntity} from "./CoreEntity";
import {SnackBar} from "../common/snackbar/SnackBar";




export class View extends CoreEntity {
    protected snackback: SnackBar;



    constructor(viewName: string) {
        super( viewName );

        this.snackback = SnackBar._instance;
    }







}