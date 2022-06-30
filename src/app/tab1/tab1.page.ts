import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';
import {UserService} from '../../services/user.service';
import {OfferService} from '../../services/offer.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor(public authService: AuthService, private router: Router, private nacCtrl: NavController,
              public offerService: OfferService, private toastService: ToastService, public userService: UserService) {}

  async ngOnInit(){}

  /**
   * Navigating to login page if the user is not logged in or to the creating page
   */
  createOffer() {
    if(this.authService.user === null){
      this.router.navigate(['login']);
      this.toastService.presentToast('Um ein Angebot zu erstellen, musst du dich anmelden!', 'danger');
    }else{
      this.router.navigate(['create-offer']);
    }
  }
}
