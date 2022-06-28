import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Offer} from '../model/offer';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private afs: AngularFirestore, public authService: AuthService) { }

  getBookedOffers(): Promise<Offer[]> {
    return new Promise((resolve, reject) => {
      const bookedOffers: Offer[] = [];
      this.afs.collection<Offer>('offer').ref.where('bookedBy', '==',this.authService.userId).get().then(docSnaps => {
        for(const docSnap of docSnaps.docs){
          const offer = docSnap.data();
          offer.offerId = docSnap.id;
          bookedOffers.push(offer);
        }
        resolve(bookedOffers);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
