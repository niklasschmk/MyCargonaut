import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from "../../model/user";
import {AuthService} from "../../services/auth.service";
import {ToastServiceService} from "../../services/toast-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionSheetController} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string;
  user: User;
  editMode = false;
  otherUser: string;
  differentUser = false;
  userOther: User;
  constructor(public userService: UserService, private router: Router, public authService: AuthService,
              private toastService: ToastServiceService, private route: ActivatedRoute,
              public actionSheetController: ActionSheetController) {
    console.log(this.userService.getUserById('feAynM4IHZNBEo3KSmtZ'));
    /*
    if(this.authService.user === null){
      this.router.navigate(['login']);
    }*/
    const eventJSON = this.route.snapshot.paramMap.get('userId');
    this.otherUser = JSON.parse(eventJSON);
    if(this.otherUser !== null && this.otherUser !== ''){
      this.differentUser = true;
      this.userService.getUserById(this.otherUser).then(user => {
        this.userOther = user;
      });
    }
  }

  ngOnInit() {
  }
  /**
   * Opens edit options
   */
  async openEditOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profiloptionen',
      buttons: [{
        text: 'Profil bearbeiten',
        handler: () => {
          this.edit('profile');
        }
      }, {
        text: 'E-Mail Adresse ändern',
        handler: () => {
          this.edit('mail');

        }
      }, {
        text: 'Passwort ändern',
        handler: () => {
          this.edit('password');
        }
      }, {
        text: 'Zurück',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }
  /**
   * Navigate to the editProfile-page.
   */
  edit(toEdit: string){
    this.router.navigate(['edit', {toEdit: JSON.stringify(toEdit)}]);
    this.closeEditOptions();
  }
  /**
   * Closes the edit options
   */
  closeEditOptions() {
    this.editMode = false;
  }
}
