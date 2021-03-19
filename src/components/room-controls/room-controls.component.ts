import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-controls',
  templateUrl: './room-controls.component.html',
  styleUrls: ['./room-controls.component.scss']
})
export class RoomControlsComponent implements OnInit {

  @Output() micStatusChange = new EventEmitter<boolean>();

  @Output() cameraStatusChange = new EventEmitter<boolean>();

  @Output() leaveChannel = new EventEmitter();

  ngOnInit(): void {}

  toggleMicrophone(status: boolean) {
    this.micStatusChange.emit(status);
  }

  toggleCamera(status: boolean) {
    this.cameraStatusChange.emit(status);
  }

  leave() {
    this.leaveChannel.emit();
  }

}
