import { Component, OnInit } from '@angular/core';
import {RideService} from '../../services/ride.service';
import {Offer} from '../../model/offer';
import {Ride} from '../../model/ride';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  viewBookedOffers= true;
  bookedOffers: Offer[];
  bookedOffersObserve: Observable<Offer[]>;
  viewRides= true;
  viewFinishedRides= true;
  rides: Ride[];
  ridesObserve: Observable<Ride[]>;
  actualRides: Ride[];
  finishedRides: Ride[];

  constructor(private rideService: RideService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.rideService.getBookedOffers().then(res => {
      this.bookedOffersObserve = res;
      this.bookedOffersObserve.subscribe(offers => {
        this.bookedOffers = offers;
      });
      this.rideService.getRidesForCustomer().then(r =>{
        this.ridesObserve = r;
        this.ridesObserve.subscribe(rides => {
          this.rides = rides;
          this.filterRides();
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  filterRides(){
    if(this.rides){
      this.finishedRides = this.rides.filter(finishedRide => finishedRide.closed);
      this.actualRides = this.rides.filter(actualRide => !actualRide.closed);
    }
  }
}

