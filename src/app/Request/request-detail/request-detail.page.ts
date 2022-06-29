import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {VehicleService} from '../../../services/vehicle.service';
import {UserService} from '../../../services/user.service';
import {ToastService} from '../../../services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {RequestService} from '../../../services/request.service';
import {Request} from '../../../model/request';
import {Observable} from 'rxjs';
import {OfferService} from '../../../services/offer.service';

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
              private authService: AuthService, private offerService: OfferService) {
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

  saveBid() {
    this.requestService.bid(this.request, this.bidPrice).then(() => {
      this.bidRequest = false;
      this.toastService.presentToast('Dein Gebot wurde gespeichert!', 'primary');
    }).catch(err => console.log(err));
  }

  acceptBid() {
  }
}
