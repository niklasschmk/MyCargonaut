import { Component, Input, OnInit } from '@angular/core';
import {Offer} from '../../model/offer';
import {User} from '../../model/user';
import {OfferService} from '../../services/offer.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
})
export class OfferCardComponent implements OnInit {
  @Input() offer: Offer;
  user: User;
  constructor(private offerService: OfferService, private authService: AuthService, private router: Router,
              private nacCtrl: NavController, private toastService: ToastService, public userService: UserService) { }

  ngOnInit() {
    this.userService.getUserById(this.offer.userId).then((user) => {
      this.user = user;
    });
  }
  openOfferDetail(offer: Offer) {
    this.router.navigate(['offer-detail', {offerId: JSON.stringify(this.offer.offerId)}]);
  }
  openOtherUser(userId: string){
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }
}
