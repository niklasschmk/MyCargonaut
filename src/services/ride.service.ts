import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Offer} from '../model/offer';
import {AuthService} from './auth.service';
import {Ride} from '../model/ride';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {ToastService} from './toast.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RideService {


  constructor(private afs: AngularFirestore, public authService: AuthService, private toastService: ToastService) {
  }


  getRideObserveById(offerId: string): Promise<Observable<Ride>> {
    return new Promise((resolve) => {
      resolve(this.afs.collection<Ride>('ride').doc(offerId).valueChanges({idField: 'rideId'}));
    });
  }


  getBookedOffers(): Promise<Observable<Offer[]>> {
    return new Promise<Observable<Offer[]>>((resolve) => {
      resolve(this.afs.collection<Offer>('offer', ref =>
        ref.where('bookedBy', '==', this.authService.userId).where('rideId', '==', null)
      ).valueChanges({idField: 'offerId'}));
    });
  }

  getMyOffers(): Promise<Observable<Offer[]>> {
    return new Promise<Observable<Offer[]>>((resolve) => {
      resolve(this.afs.collection<Offer>('offer', ref =>
        ref.where('userId', '==', this.authService.userId)).valueChanges({idField: 'offerId'}));
    });
  }

  startRide(offerId: string, bookedBy: string, date: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this.afs.collection('ride').add({
        offerId,
        status: ['Warten...'],
        statusTimes: [new Date().toISOString()],
        driverUserId: this.authService.userId,
        customerUserId: bookedBy,
        closed: false,
        paid: false,
        date
      }).then(docRef => {
        const rideId: string = docRef.id;
        this.afs.collection('offer').doc(offerId).update({
          rideId
        }).then(() => {
          resolve(rideId);
        });
      });
    });
  }

  getMyRides(): Promise<Observable<Ride[]>> {
    return new Promise<Observable<Ride[]>>((resolve) => {
      resolve(this.afs.collection<Ride>('ride', ref =>
        ref.where('driverUserId', '==', this.authService.userId)).valueChanges({idField: 'rideId'}));
    });
  }

  getRidesForCustomer(): Promise<Observable<Ride[]>> {
    return new Promise<Observable<Ride[]>>((resolve) => {
      resolve(this.afs.collection<Ride>('ride', ref =>
        ref.where('customerUserId', '==', this.authService.userId)).valueChanges({idField: 'rideId'}));
    });
  }

  saveStatus(newStatus: string, rideId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (newStatus === undefined) {
        this.toastService.presentToast('Bitte wähle einen Status aus!', 'danger');
        reject();
      }
      this.afs.collection('ride').doc(rideId).update({
        status: firebase.firestore.FieldValue.arrayUnion(newStatus),
        statusTimes: firebase.firestore.FieldValue.arrayUnion(new Date().toISOString()),
      }).then(() => {
        resolve();
      });
    });
  }

  finishRide(rideId: string, driverId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (driverId === this.authService.userId) {
        this.afs.collection('ride').doc(rideId).update({
          closed: true,
          closedDate: new Date().toISOString(),
        }).then(() => resolve());
      } else {
        reject('finishRide: no auth!');
      }
    });
  }

  setRideToPaid(rideId: string): Promise<void> {
    console.log(rideId);
    return new Promise<void>((resolve) => {
      this.afs.collection<Ride>('ride').doc(rideId).update({
        paid: true
      }).then(() => {
        resolve();
      });
    });
  }
}
