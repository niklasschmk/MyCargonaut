import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor(private toastController: ToastController) { }
  /**
   * Shows to the user a message
   *
   * @param text Contains text of this message
   * @param role Contains color of the message
   */
  async presentToast(text: string, role: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      color: role,
    });
    await toast.present();
  }
}
