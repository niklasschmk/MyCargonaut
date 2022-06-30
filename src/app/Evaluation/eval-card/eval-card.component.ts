import {Component, Input, OnInit} from '@angular/core';
import {Evaluation} from "../../../model/evaluation";
import {User} from "../../../model/user";
import {EvaluationService} from "../../../services/evaluation.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../services/toast.service";
import {UserService} from "../../../services/user.service";
import {NavController} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-eval-card',
  templateUrl: './eval-card.component.html',
  styleUrls: ['./eval-card.component.scss'],
})
export class EvalCardComponent implements OnInit {
  @Input() eval: Evaluation;
  user: User;
  fullLength: boolean;
  constructor(public evaluationService: EvaluationService, private router: Router,
              private navCtrl: NavController, private toastService: ToastService,
              public authService: AuthService, public userService: UserService) { }

  ngOnInit() {
    this.userService.getUserById(this.eval.rater).then(user => {
      this.user = user;
    });
  }
  /**
   * Set attribute fullLength to true to show the complete text of the eval
   */
  showAll() {
    this.fullLength = true;
  }

  /**
   * Set attribute fullLength to false to hide the complete text of the eval
   */
  hideAll() {
    this.fullLength = false;
  }
  /**
   * Navigate to edit evaluation page for this evaluation
   */
  editEval() {
    this.router.navigate(['evaluate', {evalId: JSON.stringify(this.eval.evaluationId)}]);
  }
  /**
   * Delete this evaluation
   */
  deleteEval() {
    this.evaluationService.deleteEval(this.eval.evaluationId).then(() => {
      this.toastService.presentToast('Bewertung erfolgreich gelöscht!', 'primary');
    }).catch(err => {
    });
  }

  /**
   * Opens a other user
   * @param userId ID of the other user
   */
  openOtherUser(userId: string){
    this.router.navigate(['otherUser', {userId: JSON.stringify(userId)}]);
  }
}
