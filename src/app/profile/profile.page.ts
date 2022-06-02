import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService) {
    console.log(this.userService.getUserById('feAynM4IHZNBEo3KSmtZ'));
  }

  ngOnInit() {
  }

}
