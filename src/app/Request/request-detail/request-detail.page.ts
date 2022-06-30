import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {VehicleService} from '../../../services/vehicle.service';
import {UserService} from '../../../services/user.service';
import {ToastService} from '../../../services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {RequestService} from '../../../services/request.service';
import {Request} from '../../../model/request';
import {NavController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {OfferService} from '../../../services/offer.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.page.html',
  styleUrls: ['./request-detail.page.scss'],
})
export class RequestDetailPage implements OnInit {
  requestId: string;
  requestObserve: Observable<Request>;
  request: Request;
  user: User;
  error = false;
  ownRequest: boolean;
  bidRequest = false;
  bidPrice: number;
  lowestBidUser: User;

  constructor(public requestService: RequestService, public vehicleService: VehicleService, private userService: UserService,
              public toastService: ToastService,
              private route: ActivatedRoute, private router: Router,
              public authService: AuthService, private navCtrl: NavController,
              private alertService: AlertService, private offerService: OfferService) {
    const requestJSON = this.route.snapshot.paramMap.get('requestId');
    this.requestId = JSON.parse(requestJSON);
    //get request
    this.requestService.getRequestObserveById(this.requestId).then(request => {
      this.requestObserve = request;
      this.requestObserve.subscribe(req => {
        this.request = req;
        this.ownRequest = (this.request.userId === this.authService.userId);
        if (this.request.lowestBidUserId) {
          this.userService.getUserById(this.request.lowestBidUserId).then(lbuser => {
            this.lowestBidUser = lbuser;
          });
        }
        this.userService.getUserById(this.request.userId).then((user) => {
          this.user = user;
        }).catch(e => {
          this.error = true;
          console.log(e);
        });
      });
    });
    console.log(this.request);
  }

  ngOnInit() {
  }

  /**
   * Opening the request owner by his ID
   * @param userId ID of the request owner
   */
  openOtherUser(userId: string) {
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }

  /**
   * Checking if the user is logged in
   */
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

  /**
   * Editing a request
   * @param requestId ID of the request
   */
  async editRequest(requestId: string) {
    await this.router.navigate(['create-request', {requestId: JSON.stringify(requestId)}]);
  }

  /**
   * Deleting a request by calling delete function in request service
   */
  deleteRequest() {
    this.requestService.deleteRequest(this.requestId).then(() => {
      this.toastService.presentToast('Angebot erfolgreich gelöscht!', 'primary');
      this.navCtrl.pop();
    });
  }


  saveBid() {
    this.requestService.bid(this.request, this.bidPrice).then(() => {
      this.bidRequest = false;
      this.toastService.presentToast('Dein Gebot wurde gespeichert!', 'primary');
    }).catch(err => console.log(err));
  }

  acceptBid() {
    this.alertService.presentAlertConfirm('Gebot annehmen?', 'Sind Sie sicher dass Sie dieses Gebot annehmen möchten?').then(res => {
      if (res) {
        this.offerService.createOfferFromRequest(this.request).then((offerId) => {
          this.router.navigate(['offer-detail', {offerId: JSON.stringify(offerId)}]).then(() => {
            this.toastService.presentToast('Das Angebot wurde erfolgreich angenommen!', 'primary');
          });
        });
      }
    });
  }
}

