import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {User} from '../model/user';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: AngularFirestoreCollection<User>;
  private otherUserId: string;

  constructor(private afs: AngularFirestore, private toastService: ToastService) {
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
          const user = doc.data();
          user.userId = doc.id;
          resolve(user);
        } else {
          reject('user not found');
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
   * @param birthDay
   * @param firstName
   * @param lastName
   * @param lastName
   * @param birthDay
   * @param picturePath
   */
  createUser(email: string, userName: string, userId: string, firstName: string, lastName: string,
             birthDay: string, picturePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userCollection.doc(userId).set({
        email,
        userName,
        firstName,
        lastName,
        cargoCoins: 0,
        birthDay,
        picturePath
      }).then(() => {
        resolve();
      }).catch(() => {
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
    return new Promise((resolve) => {
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

  /**
   * pay a ride
   *
   * @param price
   * @param customerUserId
   * @param driverUserId
   */
  payRide(price: number, customerUserId: string, driverUserId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let customerCoins: number;
      let driverCoins: number;
      this.userCollection.doc(customerUserId).ref.get().then(user => {
        customerCoins = user.data().cargoCoins;
        if (customerCoins < price) {
          this.toastService.presentToast('Du hast nicht genügend CargoCoins auf dem Konto um diese ' +
            'Fahrt zu bezahlen!', 'danger').then();
          reject();
          return;
        }
      });
      this.userCollection.doc(driverUserId).ref.get().then(user => {
        driverCoins = user.data().cargoCoins;
        const newCustomerCoins: number = customerCoins - price;
        const newDriverCoins: number = driverCoins + price;
        this.userCollection.doc(customerUserId).update({
          cargoCoins: newCustomerCoins
        }).then(() => {
          this.userCollection.doc(driverUserId).update({
            cargoCoins: newDriverCoins
          }).then(() => {
            resolve();
          });
        });
      });
    });
  }

  /**
   * add new coins for a user (demo function)
   *
   * @param userId
   */
  addCoins(userId: string) {
    let coins: number;
    this.userCollection.doc(userId).ref.get().then(user => {
      coins = user.data().cargoCoins;
    }).then(() => {
      this.userCollection.doc(userId).update({
        cargoCoins: coins + 200,
      }).then();
    });
  }
}
