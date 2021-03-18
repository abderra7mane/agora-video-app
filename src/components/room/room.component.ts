import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CallService } from '@app/services';
import { User } from '@app/shared';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  localUser: User;

  get remoteUsers() { return this.callService.remoteUsers; }

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private callService: CallService
  ) { }

  ngOnInit(): void {
    const paramsSubs = this.activatedRoute.params.subscribe((params) => {
      this.callService.joinChannel(params.id).then(() => {
        this.localUser = {
          type: 'local',
          uid: this.callService.userId,
          displayName: this.callService.displayName || 'Me',
          mediaTrack: this.callService.userMediaTrack
        };
      });
    });
    this.subscriptions.push(paramsSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });

    this.callService.leaveChannel();
  }

}
