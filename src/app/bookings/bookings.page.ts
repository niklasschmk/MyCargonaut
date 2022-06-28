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
  rides: Ride[];

  constructor(private rideService: RideService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.rideService.getBookedOffers().then(res => {
      this.bookedOffers = res;
    }).catch(err => {
      console.log(err);
    });
  }
}

