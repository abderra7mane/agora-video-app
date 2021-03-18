import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CallService, MediaService } from '@app/services';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  constructor(
    private router: Router, 
    private callService: CallService,
    private mediaService: MediaService
  ) { }

  ngOnInit() {}

  joinRoom(form: NgForm) {
    if (form.invalid)
      return;

    const { roomId, displayName } = form.value;
    this.callService.displayName = displayName;

    this.router.navigate(['/room', roomId]);
  }

}
