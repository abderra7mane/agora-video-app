import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CallService } from '@app/services';
import { uuid } from '@app/shared';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  constructor(
    private router: Router, 
    private callService: CallService
  ) { }

  ngOnInit(): void {}

  joinRoom(form: NgForm) {
    if (form.invalid)
      return;

    const { roomId, displayName } = form.value;

    this.callService.userId = uuid();
    this.callService.displayName = displayName;

    this.router.navigate(['/room', roomId]);
  }

}
