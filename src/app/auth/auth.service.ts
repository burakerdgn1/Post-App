import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from '../../environment/environment'

const globalUrl = environment.apiUrl + "/user/";
@Injectable({ providedIn: 'root' })
export class AuthService {

    private token: string;
    private authStatusListener = new BehaviorSubject(false);
    constructor(private http: HttpClient, private router: Router) { }
    private tokenTimer: any;
    private userId: string;

    getToken() {
        return this.token;
    }

    getUsedId() {
        return this.userId;
    }


    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post(globalUrl + '/signup/', authData).subscribe(() => {
            this.router.navigate(['/'])
        }, error => {
            this.authStatusListener.next(false);
        })

    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>(globalUrl + '/login/', authData).subscribe(
            response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.authStatusListener.next(true);
                    this.userId = response.userId;
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }

            }, error => {
                this.authStatusListener.next(false);
            }
        )
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);

        }

    }

    logout() {
        this.token = null;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}