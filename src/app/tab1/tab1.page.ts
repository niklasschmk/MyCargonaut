import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {ToastService} from "../../services/toast.service";
import {UserService} from "../../services/user.service";
import {OfferService} from "../../services/offer.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  public offers: any;

  constructor(public authService: AuthService, private router: Router, private nacCtrl: NavController,
              private offerService: OfferService, private toastService: ToastService, public userService:UserService,
              private firestore: AngularFirestore) {}

  async ngOnInit(){
    this.offers = await this.initializeItems();
  }
  async initializeItems(): Promise<any> {
    return await this.firestore.collection('offer').valueChanges({idField: 'id'}).pipe(first()).toPromise();
  }

  createOffer() {
    if(this.authService.user === null){
      this.router.navigate(['login']);
      this.toastService.presentToast('Um ein Angebot zu erstellen, musst du dich anmelden!', 'danger');
    }else{
      this.router.navigate(['create-offer']);
    }
  }
}
