import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController) { }

  /**
   * Confirm window is displayed
   *
   * @param head Head of confirm window
   * @param text Text of confirm message
   */
  async presentAlertConfirm(head: string, text: string): Promise<boolean> {
    return new Promise((async (resolve, reject) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: head,
        message: text,
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
            cssClass: 'secondary',
            id: 'cancel-button',
            handler: (blah) => {
              resolve(false);
            }
          }, {
            text: 'Bestätigen',
            id: 'confirm-button',
            cssClass: 'danger',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    }));
  }
}
