import { Component, OnInit } from '@angular/core';
import {RideService} from '../../services/ride.service';
import {Offer} from '../../model/offer';
import {Ride} from '../../model/ride';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  viewBookedOffers= true;
  bookedOffers: Offer[];
  viewRides= true;
  viewFinishedRides= true;
  rides: Ride[];
  actualRides: Ride[];
  finishedRides: Ride[];

  constructor(private rideService: RideService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.rideService.getBookedOffers().then(res => {
      this.bookedOffers = res;
      this.rideService.getRidesForCustomer().then(r =>{
        this.rides = r;
        this.filterRides();
      });
    }).catch(err => {
      console.log(err);
    });
  }

  filterRides(){
    this.finishedRides = this.rides.filter(finishedRide => finishedRide.closed);
    this.actualRides = this.rides.filter(actualRide => !actualRide.closed);
  }
}

