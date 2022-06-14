import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ToastService} from '../../services/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  newUser = false;
  resetPass = false;
  email: string;
  password: string;
  username: string;
  loginForm: FormGroup;
  birthDay: Date;

  validationMessages = {
    username: [
      {type: 'required', message: 'Bitte gib einen Nutzernamen an!'},
      {type: 'minlength', message: 'Der Nutzername muss mindestens 3 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Nutzername darf höchstens 20 Zeichen lang sein!'}
    ],
    email: [
      {type: 'required', message: 'Bitte gib eine E-Mail-Adresse an!'},
      {type: 'email', message: 'Bitte gib eine valide E-Mail Adresse ein!'},
    ],
    password: [
      {type: 'required', message: 'Bitte gib ein Passwort an!'},
      {type: 'minlength', message: 'Das Passwort muss mindestens 6 Zeichen lang sein!'},
      {type: 'minlength', message: 'Das Passwort darf höchstens 25 Zeichen lang sein!'},
    ],
  };

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private router: Router,
              private userService: UserService, public toastService: ToastService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ]))
    });
  }

  ngOnInit() {
  }

  /**
   * Calls the register function of the authService and the
   * createUser Function of the userService with the given data of the input fields
   */
  register() {
    if (this.loginForm.valid) {
      this.authService.register(this.email, this.password).then((userCredential) => {
        this.userService.createUser(this.email, this.username, userCredential.user.uid, this.birthDay).then(() => {
          this.router.navigate(['tabs/tab1']);
        });
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder korrekt aus', 'error');
    }
  }

  /**
   * Calls the login Function of the userService with the given data of the input fields
   */
  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.email, this.password).then(() => {
        this.router.navigate(['tabs/tab1']);
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder korrekt aus', 'error');
    }
  }

  /**
   * Switches from login to register formular
   */
  switchToRegister() {
    this.newUser = true;
    this.resetPass = false;
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25),
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ]))
    });
  }

  /**
   * Switches from register to login formular
   */
  switchToLogin() {
    this.newUser = false;
    this.resetPass = false;
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ])),
    });
  }

  /**
   * Switches to reset formular
   */
  switchToResetPassword() {
    this.newUser = false;
    this.resetPass = true;
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
    });
  }


  signInWithGoogle() {
    /**
     * Sign in with google
     */
    this.authService.signInWithGoogle();
  }

}
