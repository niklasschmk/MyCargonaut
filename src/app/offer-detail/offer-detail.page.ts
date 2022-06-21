import {Component, OnInit} from '@angular/core';
import {Offer} from '../../model/offer';
import {Vehicle} from '../../model/vehicle';
import {OfferService} from '../../services/offer.service';
import {VehicleService} from '../../services/vehicle.service';
import {ToastService} from '../../services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

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
  available = false;
  booked = false;
  error: boolean;

  constructor(public offerService: OfferService, public vehicleService: VehicleService, private userService: UserService,
              public toastService: ToastService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    const offerJSON = this.route.snapshot.paramMap.get('offerId');
    this.offerId = JSON.parse(offerJSON);
    //get offer
    this.offerService.getOfferById(this.offerId, false).then(offer => {
      this.offer = offer;
      if (this.offer.bookedBy === null) {
        this.available = true;
      } else if (this.offer.bookedBy === this.authService.userId) {
        this.booked = true;
      }
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

  openOtherUser(userId: string) {
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }

  loginCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.authService.userId === '0') {
        resolve(false);
        this.toastService.presentToast('Hierzu musst du dich anmelden!', 'primary');
      } else {
        resolve(true);
      }
    });
  }

  book() {
    this.loginCheck().then(loggedIn => {
      if (loggedIn) {
        this.offerService.book(this.authService.userId, this.offerId).then(() => {
          this.available = false;
          this.booked = true;
          this.toastService.presentToast('Die Buchung war erfolgreich!', 'primary');
        }).catch(e => {
          console.log(e);
        });
      }
    });
  }

  resetBook() {
    this.loginCheck().then(loggedIn => {
      if (loggedIn) {
        this.offerService.resetBook(this.offerId).then(() => {
          this.available = true;
          this.booked = false;
          this.toastService.presentToast('Die Buchung wurde storniert!', 'primary');
        });
      }
    });
  }
}