import {Component, Input, OnInit} from '@angular/core';
import {Vehicle} from '../../../model/vehicle';
import {VehicleService} from '../../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss'],
})
export class VehicleItemComponent implements OnInit {
  @Input() vehicle: Vehicle;

  constructor(public vehicleService: VehicleService) { }

  ngOnInit() {}

}
