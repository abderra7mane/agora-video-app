import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserJoinMode } from '@app/services';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  roomId: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const paramsSubs = this.activatedRoute.queryParams
      .subscribe((params) => {
        if (params.room) this.roomId = params.room;
      });
    this.subscriptions.push(paramsSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });
  }

  joinRoom(form: NgForm) {
    if (form.invalid)
      return;

    const { displayName, asSpectator } = form.value;
    const joinMode: UserJoinMode = asSpectator ? 'spectator' : 'participant';

    this.router.navigate(['/room', this.roomId], { 
      queryParams: {
        user: displayName,
        mode: joinMode
      }
    });
  }

}
