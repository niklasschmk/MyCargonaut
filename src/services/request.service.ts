import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {User} from '../model/user';
import {Request} from '../model/request';
import {ToastService} from './toast.service';
import {AlertService} from './alert.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  user: User | null = null;
  request: Observable<Request[]>;
  currentRequest: Request;
  ownRequestOfUser: Observable<Request[]>;
  requestCollection: AngularFirestoreCollection<Request>;

  constructor(private afs: AngularFirestore, private toastService: ToastService, private alertService: AlertService,
              private authService: AuthService) {
    this.requestCollection = afs.collection<Request>('request', ref =>
      ref.orderBy('destination', 'asc'));
    this.request = this.requestCollection.valueChanges({idField: 'requestId'});
  }
  createRequest(cargoSpace: number, date: string, destination: string, seats: number, start: string, userId: string, requestId: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('request').doc(requestId).set({
        userId: this.authService.user.userId,
        cargoSpace,
        date,
        destination,
        seats,
        start
      }).then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }
  editRequest(requestId, cargoSpace, date, destination, seats, start) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('request').doc(requestId).update({
        cargoSpace,
        date,
        destination,
        seats,
        start
      }).then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }
  getRequestById(requestId: string, checkAuth: boolean): Promise<Request> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      this.requestCollection.doc(requestId).ref.get().then((doc) => {
        if(doc.exists){
          if(!checkAuth){
            resolve(doc.data());
          } else {
            const request1 = doc.data();
            if(request1.userId === this.authService.user.userId){
              resolve(request1);
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
   * Gets own Request of user and saves them in Service
   */
  getOwnEventsOfUser() {
    this.ownRequestOfUser = this.afs.collection<Request>('request', ref =>
      ref
        .where('userId', '==', this.authService.userId)
    ).valueChanges({idField: 'id'});
  }
  deleteRequest(requestId: string) {
    return new Promise<any>(async (resolve, reject) => {
      //TODO: Auth
      //open delete confirm alert
      await this.alertService.presentAlertConfirm('Löschen bestätigen',
        'Sind Sie sicher, dass Sie das Gesuch löschen möchten?').then(confirm => {
        if (confirm) {
          //only delete if user confirmed
          //let currentUser = firebase.auth().currentUser;
          this.afs.collection('request').doc(requestId).delete()
            .then(
              res => resolve(res),
              err => reject(err)
            );
        }
      });
    });
  }
}
