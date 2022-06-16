import { Component, OnInit } from '@angular/core';
import {Offer} from '../../model/offer';
import {Vehicle} from '../../model/vehicle';
import {OfferService} from '../../services/offer.service';
import {VehicleService} from '../../services/vehicle.service';
import {ToastService} from '../../services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.page.html',
  styleUrls: ['./offer-detail.page.scss'],
})
export class OfferDetailPage implements OnInit {
  offerId: string;
  offer: Offer;
  vehicle: Vehicle;
  user: User;
  available: boolean;
  booked: boolean;
  error: boolean;

  constructor(public offerService: OfferService, public vehicleService: VehicleService, private userService: UserService,
              public toastService: ToastService, private route: ActivatedRoute, private router: Router) {
    const offerJSON = this.route.snapshot.paramMap.get('offerId');
    this.offerId = JSON.parse(offerJSON);
    //get offer
    this.offerService.getOfferById(this.offerId, false).then(offer => {
      this.offer = offer;
      //get vehicle data
      this.vehicleService.getVehicleById(this.offer.vehicleId).then(vehicle => {
        this.vehicle = vehicle;
        this.userService.getUserById(this.offer.userId).then((user) => {
          this.user = user;
        }).catch(e => {
          this.error = true;
          console.log(e);
        });
      }).catch(e => {
        this.error = true;
        console.log(e);
      });
    }).catch(e => {
      this.error = true;
      console.log(e);
    });
  }

  ngOnInit() {
  }

  openOtherUser(userId: string){
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }
}
