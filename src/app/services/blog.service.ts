import { Injectable } from '@angular/core';
import { IBlog } from '../interfaces/iblog';
import { IUsers } from '../interfaces/iusers';
@Injectable({ providedIn: 'root' })

export class BlogService {
  users: IUsers[] = [{ id: 1, username: 'admin', email: 'admin@gmail.com', password: 'admin' }];
  blogs: IBlog[] = [{ id: 1, postedBy: 'admin', topic: 'First post', date: new Date('May 22, 2020 10:00:00'), message: 'Sign Up to create your account and start to use Angular Blog' }];

  constructor() { }
}
