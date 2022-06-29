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
import {EvaluationService} from '../../services/evaluation.service';
import {Observable} from 'rxjs';
import {Evaluation} from '../../model/evaluation';


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
  evaluations: Observable<Evaluation[]>;
  myOffers: Offer[] = [];
  myOffersObserve: Observable<Offer[]>;
  rides: Ride[] = [];
  ridesObserve: Observable<Ride[]>;
  finishedRides: Ride[] = [];
  actualRides: Ride[] = [];
  vehicles: Vehicle[] = [];
  vehicleObserve: Observable<Vehicle[]>;

  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute,
              public authService: AuthService, public vehicleService: VehicleService, public rideService: RideService,
              public evaluationService: EvaluationService) {
    const userJSON = this.route.snapshot.paramMap.get('userId');
    this.otherUser = JSON.parse(userJSON);
    if(this.otherUser !== null && this.otherUser !== ''){
      this.differentUser = true;
      this.userService.getUserById(this.otherUser).then(user => {
        this.userOther = user;
        this.evaluationService.getEvaluationsById(this.otherUser);
      });
    }
  }

  ionViewWillEnter(){
   this.getData();
  }

  ngOnInit() {
    if(!this.differentUser){
      if(this.authService.user) {
        this.evaluationService.getEvaluationsById(this.authService.user.userId);
      }
    }
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
    this.rideService.getMyOffers().then(res => {
      this.myOffersObserve = res;
      this.myOffersObserve.subscribe(offers => {
        this.myOffers = offers;
      });
    }).then(() => {
      this.rideService.getMyRides().then(res => {
        this.ridesObserve = res;
        this.ridesObserve.subscribe(rides => {
          this.rides = rides;
          this.filterRides();
        });
      }).then(() => {
        this.vehicleService.getVehicles().then(res => {
          this.vehicleObserve = res;
          this.vehicleObserve.subscribe(vehicles => {
            this.vehicles = vehicles;
          });
        });
      });
    });
  }

  filterRides(){
    if(this.rides){
      this.finishedRides = this.rides.filter(finishedRide => finishedRide.closed);
      this.actualRides = this.rides.filter(actualRide => !actualRide.closed);
    }
  }
}
