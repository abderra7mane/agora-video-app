import { Component, OnInit } from '@angular/core';
import { CallService } from '@app/services';

@Component({
  selector: 'app-room-controls',
  templateUrl: './room-controls.component.html',
  styleUrls: ['./room-controls.component.scss']
})
export class RoomControlsComponent implements OnInit {

  constructor(private callService: CallService) { }

  ngOnInit(): void {}

  toggleMicrophone(status: boolean) {
    this.callService.setMicStatus(status);
  }

  toggleCamera(status: boolean) {
    this.callService.setCameraStatus(status);
  }

}
