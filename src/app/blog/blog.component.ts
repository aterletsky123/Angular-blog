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
  users: IUsers[] = [];
  posts: IBlog[] = [];
  currentUser!: IUsers;
  isAuthorized = false;

  modalSignIn: any; modalSignUp: any; modalAddPost: any;
  editID!: number; editPostedBy!: string; editDate!: Date;
  editStatus = false;
  signInEmail = ''; signInPass = '';
  signUpUsername = ''; signUpEmail = ''; signUpPass = '';
  postTitle = ''; postText = '';
  errorMassage = '';

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.users = this.blogService.getUsers();
    this.posts = this.blogService.getBlogs();

    this.modalSignIn = new window.bootstrap.Modal(document.getElementById('sign-In'));
    this.modalSignUp = new window.bootstrap.Modal(document.getElementById('sign-Up'));
    this.modalAddPost = new window.bootstrap.Modal(document.getElementById('add-post'))
  }

  closeModalSignIn(): void {
    this.modalSignIn.hide();
    this.signInEmail = '';
    this.signInPass = '';
    this.errorMassage = '';
  }

  closeModalSignUp(): void {
    this.modalSignUp.hide();
    this.signUpUsername = '';
    this.signUpEmail = '';
    this.signUpPass = '';
    this.errorMassage = '';
  }

  closeModalAddPost(): void {
    this.modalAddPost.hide();
    this.postTitle = '';
    this.postText = '';
    this.errorMassage = '';
  }

  checkUser(): void {
    if (this.signInEmail && this.signInPass) {
      this.blogService.getUsers().forEach(user => { if (user.email.toLowerCase() === this.signInEmail.toLowerCase() && user.password.toLowerCase() === this.signInPass.toLowerCase()) this.currentUser = user });
      if (this.currentUser) {
        this.isAuthorized = true;
        this.closeModalSignIn();
      } else { this.errorMassage = 'User not found' }
    } else { this.errorMassage = 'Please fill in all fields' }
  }

  addUser(): void {
    const usernameRegExp: boolean = /^[a-zA-z]{3,16}$/.test(this.signUpUsername);
    const emailRegExp: boolean = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.signUpEmail);
    const passwordRegExp: boolean = /^[\w\_\-\.]{4,16}$/.test(this.signUpPass);

    if (usernameRegExp && emailRegExp && passwordRegExp) {
      if (this.blogService.getUsers().find(user => user.username.toLowerCase() === this.signUpUsername.toLowerCase())) { this.errorMassage = 'This username is already taken' }
      else if (this.blogService.getUsers().find(user => user.email.toLowerCase() === this.signUpEmail.toLowerCase())) { this.errorMassage = 'This email is already taken' }
      else {
        const currentID = this.users.length + 1;
        const newUser: IUsers = { id: currentID, username: this.signUpUsername, email: this.signUpEmail, password: this.signUpPass };
        this.blogService.addUser(newUser);
        this.closeModalSignUp();
      }
    } else {
      if (!this.signUpUsername || !this.signUpEmail || !this.signUpPass) { this.errorMassage = 'Please fill in all fields' }
      else if (!usernameRegExp) { this.errorMassage = 'Please provide a valid Username.' }
      else if (!emailRegExp) { this.errorMassage = 'Please provide a valid Email.' }
      else if (!passwordRegExp) { this.errorMassage = 'Please provide a valid Password.' }
    }
  }

  addPost(): void {
    if (this.postTitle && this.postText) {
      const currentID = this.posts.length + 1;
      const newPost: IBlog = { id: currentID, postedBy: this.currentUser.username, topic: this.postTitle, date: new Date(), message: this.postText }
      this.blogService.addPost(newPost);
      this.closeModalAddPost();
    } else { this.errorMassage = 'Please fill in all fields' }
  }

  saveEditPost(): void {
    if (this.postTitle && this.postText) {
      const updatePost: IBlog = { id: this.editID, postedBy: this.editPostedBy, topic: this.postTitle, date: this.editDate, message: this.postText }
      this.blogService.updatePost(updatePost, this.editID);
      this.closeModalAddPost();
      this.editStatus = false;
    } else { this.errorMassage = 'Please fill in all fields' }
  }

  editPost(post: IBlog): void {
    this.postTitle = post.topic;
    this.postText = post.message;
    this.editStatus = true;
    this.editID = post.id;
    this.editDate = post.date;
    this.editPostedBy = post.postedBy;
  }

  deletePost(post: IBlog): void { this.blogService.deletePost(post.id) }

  signOut(): void { this.isAuthorized = false }
}
