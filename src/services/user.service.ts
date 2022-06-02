import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.userCollection = afs.collection<User>('user');
  }

  /**
   * Getting a user.
   *
   * @param userId UserId of the user.
   */
  getUserById(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userCollection.doc(userId).ref.get().then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject('not found');
        }
      });
    });
  }
}
