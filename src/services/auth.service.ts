import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from '../model/user';
import {UserService} from './user.service';
import {getAuth, onAuthStateChanged, GoogleAuthProvider} from 'firebase/auth';
import 'firebase/compat/auth';
import {ToastService} from './toast.service';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null = null;
  userId: string | null = '0';
  userEmail: string | null = '';

  authUser: any;

  constructor(public auth: AngularFireAuth, public toastService: ToastService, public userService: UserService) {
    const currentAuth = getAuth();
    onAuthStateChanged(currentAuth, (authUser) => {
      if (authUser) {
        //user signed in
        this.userId = authUser.uid;
        this.userEmail = authUser.email;
        this.userService.getUserById(authUser.uid).then((user) => {
          this.user = user;
          this.user.userId = authUser.uid;
        });
      } else {
        //user signed out
        this.userId = '0';
        this.userEmail = '';
        this.authUser = undefined;
      }
    });
  }

  /**
   * Register a new user in Firebase
   *
   * @param email
   * @param password
   */
  register(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        this.toastService.presentToast('Der Nutzer wurde registriert', 'success').then();
        resolve(userCredential);
      }).catch(err => {
        this.toastService.presentToast(err.message, 'danger').then();
        reject(err);
      });
    });
  }

  /**
   * Login with an existing user in Firebase
   *
   * @param email
   * @param password
   */
  login(email, password): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then(() => {
        this.toastService.presentToast('Der Nutzer wurde angemeldet', 'success').then();
        resolve();
      }).catch(err => {
        this.toastService.presentToast(err.message, 'danger').then();
        reject();
      });
    });
  }

  /**
   * Log out the current user, set all user data to null, show toast alert
   */
  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.signOut().then(() => {
        this.userId = '0';
        this.user = null;
        this.toastService.presentToast('Nutzer erfolgreich ausgeloggt!', 'primary').then();
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Open Popup with Google sign in method
   */
  signInWithGoogle(): Promise<void> {
    return new Promise<void>(() => {
      const provider = new GoogleAuthProvider();
      this.auth.signInWithPopup(provider).then((result) => {
        this.userService.checkIfUserExists(result.user.uid).then(userExists => {
          console.log(userExists);
          if (!userExists) {
            this.userService.createUser(result.user.email, result.user.email, result.user.uid, '', '', undefined, undefined).then();
          }
        });
      }).catch(()=>{
        this.toastService.presentToast('Ein Fehler ist aufgetreten', 'danger').then();
      });
    });
  }
}
