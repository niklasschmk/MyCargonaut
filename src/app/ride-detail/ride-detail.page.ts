import { Component, OnInit } from '@angular/core';
import {RideService} from '../../services/ride.service';
import {OfferService} from '../../services/offer.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VehicleService} from '../../services/vehicle.service';
import {Offer} from '../../model/offer';
import {User} from '../../model/user';
import {Vehicle} from '../../model/vehicle';
import {Ride} from '../../model/ride';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-ride-detail',
  templateUrl: './ride-detail.page.html',
  styleUrls: ['./ride-detail.page.scss'],
})
export class RideDetailPage implements OnInit {
  ownRide: boolean;
  rideId: string;
  ride: Ride;
  offer: Offer;
  user: User;
  vehicle: Vehicle;
  error = false;
  viewOfferData = true;
  editStatus = false;
  newStatus: string;
  statusOptions: string[] = ['Fahrt wird vorbereitet','Fahrt gestartet', 'Fahrt unterbrochen', 'Fahrt fortgesetzt',
    'Fahrt abgebrochen', 'Fahrt abgeschlossen'];

  constructor(public rideService: RideService, public offerService: OfferService,
              private userService: UserService, private router: Router,
              private vehicleService: VehicleService, private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
   this.getData();
  }

  getData(){
    const rideJSON = this.route.snapshot.paramMap.get('rideId');
    this.rideId = JSON.parse(rideJSON);
    this.rideService.getRideById(this.rideId, false).then((ride) => {
      this.ride = ride;
      this.ownRide = (ride.driverUserId === this.authService.userId);
      this.offerService.getOfferById(this.ride.offerId, false).then(res => {
        this.offer = res;
        this.vehicleService.getVehicleById(this.offer.vehicleId).then(v => {
          this.vehicle = v;
        }).catch(() => {this.error = true;});
      });
      this.userService.getUserById(this.ride.customerUserId).then(res => {
        this.user = res;
      }).catch(() => {this.error = true;});
    }).catch(() => {this.error = true;});
  }

  openOtherUser(userId: string){
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }

  saveStatus(){
    this.rideService.saveStatus(this.newStatus, this.rideId).then(() => {
      this.editStatus = false;
      this.getData();
    }).catch(() => {});
  }
}
