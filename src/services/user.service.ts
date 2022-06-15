import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: AngularFirestoreCollection<User>;
  private otherUserId: string;

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

  /**
   * Create a new user in the Firestore with given data. The doc id of the user in Firestore matches the auth ID of Firebase
   *
   * @param email
   * @param userName
   * @param userId
   */
  createUser(email: string, userName: string, userId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userCollection.doc(userId).set({
        email,
        userName,
        userId,
        firstName: '',
        lastName: '',
        cargoCoins: 0,
      }).then(() => {
        resolve();
      }).catch(err => {
        reject();
      });
    });
  }

  /**
   * Check if user with a certain userId exists in Firestore
   *
   * @param userId
   */
  checkIfUserExists(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userCollection.doc(userId).ref.get().then((doc) => {
        if (doc.exists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  setOtherUser(userId: string) {
    this.otherUserId = userId;
  }
}
