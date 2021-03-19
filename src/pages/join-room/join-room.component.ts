import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserJoinMode } from '@app/services';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  joinRoom(form: NgForm) {
    if (form.invalid)
      return;

    const { roomId, displayName, asSpectator } = form.value;
    const joinMode: UserJoinMode = asSpectator ? 'spectator' : 'participant';

    this.router.navigate(['/room', roomId], { 
      queryParams: {
        user: displayName,
        mode: joinMode
      }
    });
  }

}
