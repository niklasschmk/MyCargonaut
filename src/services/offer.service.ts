import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Offer} from '../model/offer';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {ToastService} from './toast.service';
import {AlertService} from './alert.service';
import {AuthService} from './auth.service';
import User = firebase.User;
import firebase from 'firebase/compat';
import {doc} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OfferService {
  user: User | null = null;
  offers: Observable<Offer[]>;
  currentOffer: Offer;
  ownOffersOfUser: Observable<Offer[]>;
  offerCollection: AngularFirestoreCollection<Offer>;

  constructor(private afs: AngularFirestore, private toastService: ToastService, private alertService: AlertService,
              private authService: AuthService) {
    this.offerCollection = afs.collection<Offer>('offer', ref =>
      ref.orderBy('destination', 'asc'));
    this.offers = this.offerCollection.valueChanges({idField: 'offerId'});
  }

  createOffer(destination: string, price: number, start: string, vehicleId: string, offerId: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('offer').doc(offerId).set({
        userId: this.authService.user.userId,
        destination,
        price,
        start,
        vehicleId
      }).then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  editOffer(offerId, destination, price, start, vehicleId) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('offer').doc(offerId).update({
        destination,
        price,
        start,
        vehicleId
      }).then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  getOfferById(offerId: string, checkAuth: boolean): Promise<Offer> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      this.offerCollection.doc(offerId).ref.get().then((doc) => {
        if(doc.exists){
          if(!checkAuth){
            resolve(doc.data());
          } else {
            const offer = doc.data();
            if(offer.userId === this.authService.user.userId){
              resolve(offer);
            } else {
              reject('no auth');
            }
          }
        } else {
          reject('not found');
        }
      });
    });
  }

  /**
   * Gets own offer of user and saves them in Service
   */
  getOwnEventsOfUser() {
    this.ownOffersOfUser = this.afs.collection<Offer>('offer', ref =>
      ref
        .where('userId', '==', this.authService.userId)
    ).valueChanges({idField: 'id'});
  }
}
