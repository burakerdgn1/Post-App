import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

//guards simply prevents unauthorized access to the website pages
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    isAuth = false;

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.isAuth = isAuthenticated;
        })
        if (!this.isAuth) {
            this.router.navigate(['/auth/login']);
        }
        return this.isAuth;
    }

}