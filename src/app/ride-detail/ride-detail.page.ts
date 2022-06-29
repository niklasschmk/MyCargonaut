import {Component, OnInit} from '@angular/core';
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
import {ToastService} from '../../services/toast.service';
import {AlertService} from '../../services/alert.service';
import {NavController} from '@ionic/angular';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-ride-detail',
  templateUrl: './ride-detail.page.html',
  styleUrls: ['./ride-detail.page.scss'],
})
export class RideDetailPage implements OnInit {
  ownRide: boolean;
  rideId: string;
  rideObserve: Observable<Ride>;
  ride: Ride;
  offer: Offer;
  user: User;
  vehicle: Vehicle;
  error = false;
  viewOfferData = true;
  editStatus = false;
  newStatus: string;
  statusOptions: string[] = ['Fahrt wird vorbereitet', 'Fahrt gestartet', 'Fahrt unterbrochen', 'Fahrt fortgesetzt',
    'Fahrt abgebrochen', 'Fahrt abgeschlossen'];

  constructor(public rideService: RideService, public offerService: OfferService,
              private userService: UserService, private router: Router,
              private vehicleService: VehicleService, private route: ActivatedRoute,
              private authService: AuthService, private toastService: ToastService,
              private alertService: AlertService, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    const rideJSON = this.route.snapshot.paramMap.get('rideId');
    this.rideId = JSON.parse(rideJSON);
    this.rideService.getRideObserveById(this.rideId).then((ride) => {
      this.rideObserve = ride;
      ride.subscribe(r => {
        this.ride = r;
        this.ownRide = (this.ride.driverUserId === this.authService.userId);
        this.offerService.getOfferById(this.ride.offerId, false).then(res => {
          this.offer = res;
          if(this.offer.vehicleId) {
            this.vehicleService.getVehicleById(this.offer.vehicleId).then(v => {
              this.vehicle = v;
            }).catch(() => {
              this.error = true;
            });
          }
        });
        this.userService.getUserById(this.ride.customerUserId).then(res => {
          this.user = res;
        }).catch((err) => {
          this.error = true;
          console.log(err);
        });
      });
    });
  }

  openOtherUser(userId: string) {
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }

  saveStatus() {
    this.rideService.saveStatus(this.newStatus, this.rideId).then(() => {
      this.editStatus = false;
      this.getData();
    }).catch(() => {
    });
  }

  showEndStatusMessage() {
    this.toastService.presentToast('Um die Fahrt abzuschließen musst du den Status auf abgeschlossen oder abgebrochen setzen!', 'danger');
  }

  finishRide() {
    this.alertService.presentAlertConfirm('Fahrt abschließen?',
      'Möchtest du die Fahrt wirklich abschließen? Das kann nicht rückgängig gemacht werden.').then(() => {
      this.rideService.finishRide(this.rideId, this.ride.driverUserId).then(() => {
        this.navCtrl.pop();
      });
    });
  }

  payRide() {
    this.userService.payRide(this.offer.price, this.ride.customerUserId, this.ride.driverUserId).then(() => {
      this.rideService.setRideToPaid(this.rideId).then(() => {
        this.toastService.presentToast('Bezahlung erfolgreich!', 'primary');
        this.getData();
      });
    });
  }
}
