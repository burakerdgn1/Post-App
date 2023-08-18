import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Router } from "express";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }

]

@NgModule({
    imports: [
        //This means we register some child routes that will be merged with the root router eventually
        RouterModule.forChild(routes),
    ]

})
export class AuthRoutingModule {

}