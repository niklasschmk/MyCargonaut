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
  myOffers: Observable<Offer[]>;

  constructor(private afs: AngularFirestore, public authService: AuthService, private toastService: ToastService) {
  }

  getRideById(offerId: string, checkAuth: boolean): Promise<Ride> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      this.afs.collection<Ride>('ride').doc(offerId).ref.get().then((doc) => {
        if (doc.exists) {
          if (!checkAuth) {
            resolve(doc.data());
          } else {
            const ride = doc.data();
            if (ride.driverUserId === this.authService.user.userId) {
              resolve(ride);
            } else {
              reject('ride: no auth');
            }
          }
        } else {
          reject('ride not found');
        }
      });
    });
  }

  getBookedOffers(): Promise<Offer[]> {
    return new Promise<Offer[]>((resolve, reject) => {
      const bookedOffers: Offer[] = [];
      this.afs.collection<Offer>('offer').ref.where('bookedBy', '==', this.authService.userId).where('rideId', '==', null)
        .get().then(docSnaps => {
        for (const docSnap of docSnaps.docs) {
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

  getMyOffers(): Promise<Offer[]> {
    return new Promise<Offer[]>((resolve, reject) => {
      //wait for authService to be initialized
      const offers: Offer[] = [];
      this.afs.collection<Offer>('offer')
        .ref.where('userId', '==', this.authService.userId)
        .get().then(docSnaps => {
        for (const docSnap of docSnaps.docs) {
          const offer = docSnap.data();
          offer.offerId = docSnap.id;
          offers.push(offer);
        }
        resolve(offers);
      }).catch(err => {
        reject(err);
      });
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

  getMyRides(): Promise<Ride[]> {
    return new Promise<Ride[]>((resolve, reject) => {
      const myRides: Ride[] = [];
      this.afs.collection<Ride>('ride')
        .ref.where('driverUserId', '==', this.authService.userId)
        .get().then(docSnaps => {
        for (const docSnap of docSnaps.docs) {
          const ride = docSnap.data();
          ride.rideId = docSnap.id;
          myRides.push(ride);
        }
        resolve(myRides);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getRidesForCustomer(): Promise<Ride[]> {
    return new Promise<Ride[]>((resolve, reject) => {
      const myRides: Ride[] = [];
      this.afs.collection<Ride>('ride')
        .ref.where('customerUserId', '==', this.authService.userId)
        .orderBy('date')
        .get().then(docSnaps => {
        for (const docSnap of docSnaps.docs) {
          const ride = docSnap.data();
          ride.rideId = docSnap.id;
          myRides.push(ride);
        }
        resolve(myRides);
      }).catch(err => {
        reject(err);
      });
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

  setRideToPaid(rideId: string): Promise<void>{
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
