import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';
import {UserService} from '../../services/user.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public authService: AuthService, private router: Router, private nacCtrl: NavController,
              public requestService: RequestService, private toastService: ToastService, public userService: UserService,
              private firestore: AngularFirestore) {}
  createRequest() {
    if(this.authService.user === null){
      this.router.navigate(['login']);
      this.toastService.presentToast('Um ein Gesuche zu erstellen, musst du dich anmelden!', 'danger');
    }else{
      this.router.navigate(['create-request']);
    }
  }
}
