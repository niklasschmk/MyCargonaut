import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EvaluationService} from "../../../services/evaluation.service";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../services/toast.service";
import {NavController} from "@ionic/angular";
import {User} from "../../../model/user";

@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.page.html',
  styleUrls: ['./create-evaluation.page.scss'],
})
export class CreateEvaluationPage implements OnInit {
  editMode = false;
  editEvalId: string;
  evalStatus = 'undefined';
  rater: string;
  stars: number = 0;
  title: string;
  text: string;
  userToBeRated: string;
  createEvalForm: FormGroup;
  validationMessages = {
    title: [
      {type: 'required', message: 'Bitte gib deiner Bewertung einen Titel'},
      {type: 'maxLength', message: 'Der Titel darf höchstens 20 Zeichen beinhalten!'},
    ],
    text: [
      {type: 'required', message: 'Bitte gib der Bewertung eine Beschreibung!'},
    ],
  };
  constructor(private route: ActivatedRoute, public evaluationService: EvaluationService,
              private toastService: ToastService, public formBuilder: FormBuilder,
              public navCtrl: NavController) {
    const evalJSON = this.route.snapshot.paramMap.get('evaluationId');
    this.editEvalId = JSON.parse(evalJSON);
    const userToBeRated = this.route.snapshot.paramMap.get('userToBeRated');
    this.userToBeRated = JSON.parse(userToBeRated);
    this.createEvalForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(20),
      ])),
      text: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    if (this.editEvalId !== null) {
      this.editMode = true;
      this.evaluationService.getEvalById(this.editEvalId, true).then(res => {
        this.stars = res.stars;
        this.title = res.title;
        this.text = res.text;
        this.evalStatus = 'found';
      }).catch(err => {
        //err = 'not found' or 'no auth', this string is used in component to render error
        this.evalStatus = err;
      });
    }
  }

  ngOnInit() {
  }

  /**
   * Check if rating-stars were changed
   * @param stars
   */
  onRatingChange(stars) {
    this.stars = stars;
  }

  /**
   * Saves the data and calls the saveEvaluation function in evaluation service
   */
  saveEval() {
    if (this.editMode) {
      //check if edit mode activated, if yes, go on with editEval function
      this.editEval();
    } else {
      if (this.createEvalForm.valid && this.stars !== undefined) {
        this.evaluationService.saveEvaluation(this.stars, this.text, this.title, this.userToBeRated).then(res => {
          this.toastService.presentToast('Bewertung wurde gespeichert!', 'primary');
          this.navCtrl.pop();
        }).catch(err => {
          this.toastService.presentToast('Ein Fehler ist aufgetreten', 'danger');
        });
      } else if (!this.createEvalForm.valid) {
        this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger');
      } else if (this.stars === undefined) {
        this.toastService.presentToast('Bitte vergib eine Anzahl an Sternen (1-5)', 'danger');
      }
    }
  }

  /**
   * Saves data changes and calls editEval function in evaluation service
   */
  editEval() {
    if (this.createEvalForm.valid) {
      this.evaluationService.editEval(this.editEvalId, this.stars, this.text, this.title).then(() => {
        this.toastService.presentToast('Bewertung erfolgreich aktualisiert!', 'success');
        this.navCtrl.pop();
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger');
    }
  }
}
