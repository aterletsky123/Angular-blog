import { Component, OnInit, ViewChild } from '@angular/core';
import { IBlog } from '../interfaces/iblog';
import { IUsers } from '../interfaces/iusers';
import { BlogService } from '../services/blog.service';
declare let window: any;
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {
  isAuthorized = false;
  modalSignIn: any; modalSignUp: any; modalAddPost: any;

  users!: IUsers[]; posts!: IBlog[];
  signInEmail = ''; signInPass = '';
  signUpUsername = ''; signUpEmail = ''; signUpPass = '';
  postTitle = ''; postText = '';

  currentUser!: IUsers;
  postedByUsername!:string;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.users = this.blogService.users;
    this.posts = this.blogService.blogs;

    this.modalSignIn = new window.bootstrap.Modal(document.getElementById('sign-In'));
    this.modalSignUp = new window.bootstrap.Modal(document.getElementById('sign-Up'));
    this.modalAddPost = new window.bootstrap.Modal(document.getElementById('add-post'))
  }

  checkUser(): void {
    if (this.signInEmail === '' || this.signInPass === '') { console.log('Please fill in all fields') }
    else {
      this.users.forEach(user => { if (user.email.toLowerCase() === this.signInEmail.toLowerCase() && user.password.toLowerCase() === this.signInPass.toLowerCase()) this.currentUser = user });
      if (this.currentUser !== undefined) {
        if (this.currentUser.username === 'admin') { console.log('you are admin') }
        else { console.log(`you are ${this.currentUser.username}`) }
        this.modalSignIn.hide();
        this.isAuthorized = true;
        this.postedByUsername = this.currentUser.username;
      }
      else { console.log('user not found') }
    }
  }

  createUser(): void {
    if (this.signUpUsername === '' || this.signUpEmail === '' || this.signUpPass === '') { console.log('Please fill in all fields') }
    else if (this.users.find(user => user.username.toLowerCase() === this.signUpUsername.toLowerCase())) { console.log('login zayniato') }
    else if (this.users.find(user => user.email.toLowerCase() === this.signUpEmail.toLowerCase())) { console.log('email zaytiany') }
    // тут має ще бути валідація? REGEXP
    else {
      const lastIndex = this.users.length + 1;
      const newUser: IUsers = { id: lastIndex, username: this.signUpUsername, email: this.signUpEmail, password: this.signUpPass };
      this.users.push(newUser);
      this.modalSignUp.hide();
    }
  }

  addPost(): void {
    if (this.postTitle === '' && this.postText === '') { console.log('Please fill in all fields') }
    else {
      const lastIndex = this.posts.length + 1;
      const newPost: IBlog = { id: lastIndex, postedBy: this.currentUser.username, topic: this.postTitle, date: new Date(), message: this.postText }
      this.posts.push(newPost);

      this.modalAddPost.hide();
      this.postTitle = ''; this.postText = '';
    }
  }

  signOut(): void {
    this.isAuthorized = false;
  }
}
