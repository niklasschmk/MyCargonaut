import {Component, Input, OnInit} from '@angular/core';
import {Offer} from '../../model/offer';
import {User} from '../../model/user';
import {OfferService} from '../../services/offer.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss'],
})
export class OfferCardComponent implements OnInit {
  @Input() offer: Offer;
  @Input() booked: boolean;
  user: User;
  userWhoBooked: User;

  constructor(private offerService: OfferService, private authService: AuthService, private router: Router,
              public userService: UserService) {
  }

  /**
   * Getting the user of the offer and the user who booked the offer
   */
  ngOnInit() {
    this.userService.getUserById(this.offer.userId).then((user) => {
      this.user = user;
    });
    if(this.booked || this.offer.bookedBy !== null) {
      this.userService.getUserById(this.offer.bookedBy).then((user) => {
        this.userWhoBooked = user;
      });
    }
  }

  /**
   * Opens detailpage of an offer
   * @param offerId ID of the offer
   */
  openOfferDetail(offerId: string) {
    this.router.navigate(['offer-detail', {offerId: JSON.stringify(offerId)}]);
  }

  /**
   * opens the user who is the owner of the offer
   * @param userId ID of the user
   */
  openOtherUser(userId: string) {
    this.userService.setOtherUser(userId);
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }
}
