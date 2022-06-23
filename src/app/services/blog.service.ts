import { Injectable } from '@angular/core';
import { IBlog } from '../interfaces/iblog';
import { IUsers } from '../interfaces/iusers';
@Injectable({ providedIn: 'root' })

export class BlogService {
  private users: IUsers[] = [{ id: 1, username: 'admin', email: 'admin@gmail.com', password: 'admin' }];
  private blogs: IBlog[] = [{ id: 1, postedBy: 'admin', topic: 'First post', date: new Date('May 22, 2020 10:00:00'), message: 'Sign Up to create your account and start to use Angular Blog' }];

  constructor() { }

  getUsers(): IUsers[] { return this.users }
  getBlogs(): IBlog[] { return this.blogs }

  addUser(newUser: IUsers): void { this.users.push(newUser) }
  addPost(newPost: IBlog): void { this.blogs.push(newPost) }

  updatePost(post: IBlog, id: number): void {
    const index = this.blogs.findIndex(post => post.id === id);
    this.blogs.splice(index, 1, post);
  }

  deletePost(id: number): void {
    const index = this.blogs.findIndex(post => post.id === id);
    this.blogs.splice(index, 1);
  }
}
