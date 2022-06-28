import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {VehicleService} from '../../services/vehicle.service';
import {User} from '../../model/user';
import {EvaluationService} from "../../services/evaluation.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  differentUser = false;
  otherUser: string;
  userOther: User;
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
    } else {
      this.evaluationService.getEvaluationsById(authService.userId);
      console.log(authService.userId);
      console.log(evaluationService.evals);
    }
  }

  ionViewDidEnter(){
    this.vehicleService.getVehicles();
  }

  ngOnInit() {
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
