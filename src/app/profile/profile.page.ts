import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {VehicleService} from '../../services/vehicle.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService, private router: Router,
              public authService: AuthService, public vehicleService: VehicleService) {
  }

  ionViewDidEnter(){
    this.vehicleService.getVehicles();
  }

  ngOnInit() {
  }

  /**
   * Navigate to Add vehicle page
   */
  openAddVehicle(){
    this.router.navigate(['add-vehicle']);
  }

  /**
   * Open Login page
   */
  openLogin(){
    this.router.navigate(['login']);
  }
}
