import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription, map } from "rxjs";




@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit, OnDestroy {
    private authListenerSubs: Subscription
    userAuthenticated = false;
    constructor(private authService: AuthService) {



    }
    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }
    ngOnInit() {
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
            isAuthenticated => {
                this.userAuthenticated = isAuthenticated;
            }
        );

    }
    onLogout() {
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
            isAuthenticated => {
                this.userAuthenticated = isAuthenticated;
            }
        );
        this.authService.logout();
    }

}