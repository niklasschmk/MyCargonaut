import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ToastService} from '../../services/toast.service';
import {Router} from '@angular/router';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  newUser = false;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  picturePath: string;
  birthDay: string;
  loginForm: FormGroup;
  file: string;
  validationMessages = {
    userName: [
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
    firstName: [
      {type: 'required', message: 'Bitte gib einen Vornamen an!'},
    ],
    lastName: [
      {type: 'required', message: 'Bitte gib einen Nachnamen an!'},
    ],
  };

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private router: Router,
              private userService: UserService, public toastService: ToastService, private imageStorage: AngularFireStorage) {
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

  ngOnInit() {
  }

  /**
   * Calls the register function of the authService and the
   * createUser Function of the userService with the given data of the input fields
   */
  register() {
    if (this.loginForm.valid) {
      this.authService.register(this.email, this.password).then((userCredential) => {
        this.userService.createUser(this.email, this.userName,
          userCredential.user.uid, this.firstName, this.lastName, '', this.picturePath).then(() => {
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
    this.loginForm = this.formBuilder.group({
      userName: new FormControl('', Validators.compose([
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
      ])),
      firstName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  /**
   * Switches from register to login formular
   */
  switchToLogin() {
    this.newUser = false;
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

  async uploadImage(event) {
    this.file = event.target.files[0];
    const pathFile = 'images/profile' + Math.floor(Math.random() * 1000);
    this.imageStorage.upload(pathFile, this.file).then(() => {
      const ref = this.imageStorage.ref(pathFile);
      ref.getDownloadURL().subscribe(url => {
        this.picturePath = url;
        this.toastService.presentToast('Bild wurde hochgeladen', 'success');
      });
    });
  }

}
