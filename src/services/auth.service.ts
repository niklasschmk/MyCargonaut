import { Injectable } from '@angular/core';
import {User} from "../model/user";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserService} from "./user.service";
import {ToastServiceService} from "./toast-service.service";
import {onAuthStateChanged} from "firebase/auth";
import {getAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null = null;
  userId: string | null = '0';
  userEmail: string | null = '';

  constructor(public auth: AngularFireAuth, public toastService: ToastServiceService, public userService: UserService) {
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
      }
    });
  }
}
