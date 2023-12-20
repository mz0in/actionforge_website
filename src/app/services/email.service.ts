import { Injectable } from "@angular/core";
import { reverseString } from "../helper/utils";
import { BehaviorSubject } from "rxjs";

const e = "ved.egrofnoitca@olleh";

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    e = new BehaviorSubject<string>("");
    e$ = this.e.asObservable();

    constructor() {
        // Set the email address with a delay
        // to avoid scam bots scraping the email address.
        setTimeout(() => {
            this.e.next(reverseString(e));
        }, 1234);
    }
}