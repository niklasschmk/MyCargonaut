import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {User} from '../model/user';
import {UserService} from './user.service';
import {
  updateEmail, updatePassword, sendPasswordResetEmail,
  sendEmailVerification, reauthenticateWithCredential, getAuth,
  onAuthStateChanged, GoogleAuthProvider} from 'firebase/auth';
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
        this.toastService.presentToast('Der Nutzer wurde registriert', 'success');
        resolve(userCredential);
      }).catch(err => {
        this.toastService.presentToast(err.message, 'danger');
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
      this.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        this.toastService.presentToast('Der Nutzer wurde angemeldet', 'success');
        resolve();
      }).catch(err => {
        this.toastService.presentToast(err.message, 'danger');
        reject();
      });
    });
  }

  /**
   * Refreshing the profile.
   */
  refreshUser(){
    return new Promise<void>((resolve, reject) => {
      if (this.userId !== '0') {
        this.userService.getUserById(this.userId).then(user => {
          this.user = user;
          resolve();
        });
      }else {
        reject();
      }
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
        this.toastService.presentToast('Nutzer erfolgreich ausgeloggt!', 'primary');
        resolve();
      }).catch(err => {
        reject();
      });
    });
  }

  /**
   * Updating the users email address.
   *
   *
   * @param mail Email of the current user.
   * @param password Password of the current user.
   */
  editingEmail(mail, password): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(this.user.email, password)
        .then((userCredential) => {
          userCredential.user.updateEmail(mail);
        }).then(() => {
        resolve();
      }).catch(err => {
        reject();
        console.log('reject');
      });
    });
  }

  /**
   * Updating the users password.
   *
   * @param oldPassword Old password of the user.
   * @param newPassword New password of the user.
   */
  editPassword(oldPassword, newPassword): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(this.user.email, oldPassword)
        .then((userCredential) => {
          userCredential.user.updatePassword(newPassword);
        }).then(() => {
        resolve();
      }).catch(err => {
        reject();
        console.log('reject');
      });
    });
  }
  /**
   * Resetting the users password.
   *
   * @param email Email of the current user, so a reset-mail can be sent.
   */
  resetPassword(email): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email).then(() => {
        this.toastService
          .presentToast('E-Mail zum Zurücksetzen des Passworts wurde verschickt!', 'primary');
        resolve();
      }).catch((error) => {
        this.toastService
          .presentToast('Mit dieser E-Mail-Adresse ist kein Nutzer registriert!', 'danger');
        reject();
      });
    });
  }

  /**
   * Open Popup with google sign in method
   */
  signInWithGoogle(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const provider = new GoogleAuthProvider();
      this.auth.signInWithPopup(provider).then((result) => {
        this.userService.checkIfUserExists(result.user.uid).then(userExists => {
          console.log(userExists);
          if (!userExists) {
            this.userService.createUser(result.user.email, result.user.email, result.user.uid, '', '', undefined);
          }
        });
      }).catch((err)=>{
        this.toastService.presentToast('Ein Fehler ist aufgetreten', 'danger');
      });
    });
  }
}
