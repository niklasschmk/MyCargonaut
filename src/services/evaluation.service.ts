import { Injectable } from '@angular/core';
import {User} from '../model/user';
import {Observable} from 'rxjs';
import {Evaluation} from '../model/evaluation';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ToastService} from './toast.service';
import {AuthService} from './auth.service';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  user: User | null = null;
  evals: Observable<Evaluation[]>;
  constructor(private afs: AngularFirestore, private toastService: ToastService,
              private alertService: AlertService, private authService: AuthService) {}
  saveEvaluation(stars: number, text: string, title: string, userId: string): Promise<Event> {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('evaluation').add({
        rater: this.authService.user.userId,
        stars,
        text,
        title,
        userId,
        date: new Date().toISOString(),
        edited: false
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }
  getEvaluationsById(userId: string | void): Promise<Observable<Evaluation[]>> {
    return new Promise<Observable<Evaluation[]>>((resolve) => {
      if(userId){
        resolve(this.afs.collection<Evaluation>('evaluation', ref =>
          ref.where('userId', '==', userId)).valueChanges({idField: 'evaluationId'}));
      } else {
        resolve(this.afs.collection<Evaluation>('evaluation', ref =>
          ref.where('userId', '==', this.authService.userId)).valueChanges({idField: 'evaluationId'}));
      }
    });
  }
  getEvalById(evalId: string, checkAuth: boolean): Promise<Evaluation> {
    return new Promise((resolve, reject) => {
      this.afs.collection<Evaluation>('evaluation').doc(evalId).ref.get().then((doc) => {
        if (doc.exists) {
          if (!checkAuth) {
            //auth check not necessary
            resolve(doc.data());
          } else {
            //auth check necessary, check if user id and logged-in user are the same
            const document = doc.data();
            if (document.rater === this.authService.user.userId) {
              resolve(document);
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
  deleteEval(evalID: string) {
    //TODO: Check if logged in user has written eval
    return new Promise<any>(async (resolve, reject) => {
      await this.alertService.presentAlertConfirm('Löschen bestätigen',
        'Sind Sie sicher, dass Sie die Bewertung löschen möchten?').then(confirm => {
          if (confirm) {
            //let currentUser = firebase.auth().currentUser;
            this.afs.collection('evaluation').doc(evalID).delete()
              .then(
                res => resolve(res),
                err => reject(err)
              );
          } else {
            reject('Löschen abgebrochen.');
          }
        }
      );
    });
  }
  editEval(evaluationId: string, stars: number, text: string, title: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('evaluations').doc(evaluationId).update({
        stars,
        text,
        title,
        date: new Date().toISOString(),
        edited: true
      })
        .then(
          res => resolve(res),
          err => reject(err)
        );
    });
  }
}
