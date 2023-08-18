import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from '../../environment/environment'

const globalUrl = environment.apiUrl + "/posts/";

@Injectable({ providedIn: 'root' })
export class PostsService {

    constructor(private http: HttpClient, private router: Router) {

    }

    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();


    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;//template expression to dynamically add values to string

        this.http.get<{ message: string, posts: any, maxPosts: number }>(globalUrl + queryParams)
            .pipe(
                map((postData) => {
                    return {
                        posts:
                            postData.posts.map((post) => {
                                return {
                                    title: post.title,
                                    content: post.content,
                                    id: post._id,
                                    imagePath: post.imagePath,
                                    creator: post.creator
                                };
                            }), maxPosts: postData.maxPosts
                    };

                })
            )
            .subscribe((transformedPostsData) => {
                this.posts = transformedPostsData.posts;
                this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
            });
    }

    getPostsUpdated() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(globalUrl + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{ message: string, post: Post }>(globalUrl, postData).subscribe(
            (responseData) => {
                this.router.navigate(['/']);
            }
        )
    }

    updatePost(id: string, title: string, content: string, image: string) {//File koy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('image', image);
            postData.append('title', title);
            postData.append('content', content);

        }
        else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null


            };

        }
        this.http.put(globalUrl + id, postData).subscribe(response => {

            this.router.navigate(['/']);

        }
        )
    }

    deletePost(postId: string) {
        return this.http.delete(globalUrl + postId);


    }
} 