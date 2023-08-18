import { NgModule } from "@angular/core";
import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";



@NgModule({
    declarations: [
        PostListComponent,
        PostCreateComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ],
    //we dont export these components because we use the through the Router!
    // exports: [
    //     PostListComponent,
    //     PostCreateComponent,
    // ]

})
export class PostsModule {

}