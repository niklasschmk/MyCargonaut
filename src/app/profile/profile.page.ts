import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {VehicleService} from '../../services/vehicle.service';
import {User} from '../../model/user';
import {EvaluationService} from "../../services/evaluation.service";
import {Observable} from "rxjs";
import {Evaluation} from "../../model/evaluation";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  differentUser = false;
  otherUser: string;
  userOther: User;
  evaluations: Observable<Evaluation[]>;
  numberOfEvals: number = 0;
  overallRating: number = 0;
  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute,
              public authService: AuthService, public vehicleService: VehicleService,
              public evaluationService: EvaluationService) {
    const userJSON = this.route.snapshot.paramMap.get('userId');
    this.otherUser = JSON.parse(userJSON);
    if(this.otherUser !== null && this.otherUser !== ''){
      this.differentUser = true;
      this.userService.getUserById(this.otherUser).then(user => {
        this.userOther = user;
        this.evaluationService.getEvaluationsById(this.otherUser);
      });
    }
  }

  ionViewDidEnter(){
    this.vehicleService.getVehicles();
  }

  ngOnInit() {
    if(!this.differentUser){
      if(this.authService.user) {
        this.evaluationService.getEvaluationsById(this.authService.user.userId);
      }
    }
  }

  /**
   * Navigate to Add vehicle page
   */
  openAddVehicle(){
    this.router.navigate(['add-vehicle']);
  }

  /**
   * Open Login page
   */
  openLogin(){
    this.router.navigate(['login']);
  }
}
