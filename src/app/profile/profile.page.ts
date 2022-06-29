import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {VehicleService} from '../../services/vehicle.service';
import {User} from '../../model/user';
import {Offer} from '../../model/offer';
import {RideService} from '../../services/ride.service';
import {Ride} from '../../model/ride';
import {Vehicle} from '../../model/vehicle';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  viewMyOffers = true;
  viewVehicles = true;
  viewRides = true;
  viewFinishedRides = true;
  differentUser = false;
  otherUser: string;
  userOther: User;
  myOffers: Offer[] = [];
  rides: Ride[] = [];
  finishedRides: Ride[] = [];
  actualRides: Ride[] = [];
  vehicles: Vehicle[] = [];

  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute,
              public authService: AuthService, public vehicleService: VehicleService, public rideService: RideService) {
    const userJSON = this.route.snapshot.paramMap.get('userId');
    this.otherUser = JSON.parse(userJSON);
    if(this.otherUser !== null && this.otherUser !== ''){
      this.differentUser = true;
      this.userService.getUserById(this.otherUser).then(user => {
        this.userOther = user;
      });
    }
  }

  ionViewWillEnter(){
   this.getData();
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

  /**
   * Open Add Offer
   */
  openAddOffer(){
    this.router.navigate(['create-offer']);
  }

  /**
   * Get Data
   */
  getData(){
    this.vehicleService.getVehicles();
    this.rideService.getMyOffers().then(res => {
      this.myOffers = res;
    }).then(() => {
      this.rideService.getMyRides().then(res => {
        this.rides = res;
      }).then(() => {
        this.filterRides();
        this.vehicleService.getVehicles().then(res => {
          this.vehicles = res;
        });
      });
    });
  }

  filterRides(){
    this.finishedRides = this.rides.filter(finishedRide => finishedRide.closed);
    this.actualRides = this.rides.filter(actualRide => !actualRide.closed);
  }
}
