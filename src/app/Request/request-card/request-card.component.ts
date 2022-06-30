import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastService} from '../../../services/toast.service';
import {UserService} from '../../../services/user.service';
import {RequestService} from '../../../services/request.service';
import {User} from '../../../model/user';
import {Request} from '../../../model/request';


@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
})
export class RequestCardComponent implements OnInit {
  @Input() request: Request;
  user: User;
  constructor(private requestService: RequestService, private authService: AuthService, private router: Router,
              private nacCtrl: NavController, private toastService: ToastService, public userService: UserService) {
  }

  /**
   * Getting the user of the request
   */
  ngOnInit() {
    this.userService.getUserById(this.request.userId).then((user) => {
      this.user = user;
    });
  }

  /**
   * Opening the request detail page
   * @param requestId ID of the request
   */
  openRequestDetail(requestId: string) {
    this.router.navigate(['request-detail', {requestId: JSON.stringify(requestId)}]);
  }

  /**
   * Opening the user of the request
   * @param userId ID of the request owner
   */
  openOtherUser(userId: string){
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }
}
