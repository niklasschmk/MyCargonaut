import {Component, Input, OnInit} from '@angular/core';
import {Ride} from '../../model/ride';
import {Offer} from '../../model/offer';
import {RideService} from '../../services/ride.service';
import {OfferService} from '../../services/offer.service';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Vehicle} from '../../model/vehicle';
import {VehicleService} from '../../services/vehicle.service';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.scss'],
})
export class RideCardComponent implements OnInit {
  @Input() ride: Ride;
  offer: Offer;
  user: User;
  vehicle: Vehicle;

  constructor(public rideService: RideService, public offerService: OfferService,
              private userService: UserService, private router: Router,
              private vehicleService: VehicleService) {}

  ngOnInit() {
    this.offerService.getOfferById(this.ride.offerId, false).then(res => {
      this.offer = res;
      this.vehicleService.getVehicleById(this.offer.vehicleId).then(v => {
        this.vehicle = v;
      });
    });
    this.userService.getUserById(this.ride.customerUserId).then(res => {
      this.user = res;
    });
  }

  openOtherUser(userId: string){
    console.log(userId);
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }

  openRideDetail(){
    this.router.navigate(['ride-detail', {rideId: JSON.stringify(this.ride.rideId)}]);
  }

}
