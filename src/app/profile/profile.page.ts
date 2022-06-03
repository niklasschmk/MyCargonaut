import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService, private router: Router,
              public authService: AuthService) {
  }

  ionViewWillEnter(){
    if(this.authService.userId === '0'){
      this.router.navigate(['login']);
    }
    console.log(this.authService.userEmail);
  }

  ngOnInit() {
  }

}
