import { Component, OnInit } from '@angular/core';
import {User} from '../../../model/user';
import {VehicleService} from '../../../services/vehicle.service';
import {UserService} from '../../../services/user.service';
import {ToastService} from '../../../services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {RequestService} from '../../../services/request.service';
import {Request} from '../../../model/request';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.page.html',
  styleUrls: ['./request-detail.page.scss'],
})
export class RequestDetailPage implements OnInit {
  requestId: string;
  request: Request;
  user: User;
  error =false;
  constructor(public requestService: RequestService, public vehicleService: VehicleService, private userService: UserService,
              public toastService: ToastService,
              private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private navCtrl: NavController) {
    const requestJSON = this.route.snapshot.paramMap.get('requestId');
    this.requestId = JSON.parse(requestJSON);
    //get request
    this.requestService.getRequestById(this.requestId, false).then(request => {
      request.requestId =this.requestId;
      this.request = request;
      this.userService.getUserById(this.request.userId).then((user) => {
        this.user = user;
      }).catch(e => {
        this.error = true;
        console.log(e);
      });
    }).catch(e => {
      this.error = true;
      console.log(e);
    });
    console.log(this.request);
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
  async editRequest(requestId: string) {
    await this.router.navigate(['create-request', {requestId: JSON.stringify(requestId)}]);
  }
  deleteRequest() {
    this.requestService.deleteRequest(this.requestId).then(() => {
      this.toastService.presentToast('Angebot erfolgreich gelöscht!', 'primary');
      this.navCtrl.pop();
    });
  }
}
