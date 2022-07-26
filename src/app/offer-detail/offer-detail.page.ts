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
import {RideService} from '../../services/ride.service';
import {AlertService} from '../../services/alert.service';
import {NavController} from '@ionic/angular';


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
  userWhoBooked: User | null;
  ownOffer: boolean;

  constructor(public offerService: OfferService, public vehicleService: VehicleService, private userService: UserService,
              public toastService: ToastService, private route: ActivatedRoute, private router: Router, public authService: AuthService,
              private rideService: RideService, private alertService: AlertService, private navCtrl: NavController) {
    const offerJSON = this.route.snapshot.paramMap.get('offerId');
    this.offerId = JSON.parse(offerJSON);
    //get offer
    this.offerService.getOfferById(this.offerId, false).then(offer => {
      this.offer = offer;
      this.ownOffer = (this.offer.userId === this.authService.userId);
      if (this.offer.bookedBy === null && this.offer.userId) {
        this.available = true;
      } else if (this.offer.bookedBy === this.authService.userId) {
        this.booked = true;
        this.userService.getUserById(this.offer.bookedBy).then((user) => {
          this.userWhoBooked = user;
          console.log(this.userWhoBooked);
        });
      } else if (this.offer.bookedBy !== null) {
        this.userService.getUserById(this.offer.bookedBy).then((user) => {
          this.userWhoBooked = user;
          console.log(this.userWhoBooked);
        });
      }
      //get vehicle data
      if (this.offer.vehicleId) {
        this.vehicleService.getVehicleById(this.offer.vehicleId).then(vehicle => {
          this.vehicle = vehicle;
        });
      }
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
  }

  ngOnInit() {
  }

  /**
   * Opens user of the offer
   *
   * @param userId ID of the user
   */
  openOtherUser(userId: string) {
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]).then();
  }

  /**
   * opens edit page
   *
   * @param offerId ID of the to edit offer
   */
  async editOffer(offerId: string) {
    await this.router.navigate(['create-offer', {offerId: JSON.stringify(offerId)}]);
  }

  /**
   * Calls the delete function in offer service
   */
  deleteOffer() {
    this.offerService.deleteOffer(this.offerId).then(() => {
      this.toastService.presentToast('Angebot erfolgreich gelöscht!', 'primary').then();
      this.navCtrl.pop().then();
    });
  }

  /**
   * Check if the user is logged in
   */
  loginCheck(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.authService.userId === '0') {
        resolve(false);
        this.toastService.presentToast('Hierzu musst du dich anmelden!', 'primary').then();
      } else {
        resolve(true);
      }
    });
  }

  /**
   * booking an offer
   */
  book() {
    this.loginCheck().then(loggedIn => {
      if (loggedIn) {
        this.offerService.book(this.authService.userId, this.offerId).then(() => {
          this.available = false;
          this.booked = true;
          this.toastService.presentToast('Die Buchung war erfolgreich!', 'primary').then();
        }).catch(e => {
          console.log(e);
        });
      }
    });
  }

  /**
   * Reset the booking
   */
  resetBook() {
    this.loginCheck().then(loggedIn => {
      if (loggedIn) {
        this.offerService.resetBook(this.offerId).then(() => {
          this.available = true;
          this.booked = false;
          this.toastService.presentToast('Die Buchung wurde storniert!', 'primary').then();
        });
      }
    });
  }

  /**
   * Starting a ride
   */
  startRide() {
    this.alertService.presentAlertConfirm('Fahrt starten?',
      'Bist du sicher dass du die Fahrt starten möchtest? Dies kann nicht rückgängig gemacht werden!').then((confirm: boolean) => {
      if (confirm) {
        this.rideService.startRide(this.offerId, this.offer.bookedBy, this.offer.date).then(() => {
          this.navCtrl.pop().then();
          this.toastService.presentToast('Die Fahrt wurde gestartet!', 'primary').then();
        });
      }
    });
  }
}
