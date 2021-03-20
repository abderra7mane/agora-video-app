import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { forkJoin, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AgoraService, User } from '@app/services';
import { SHARE_LINK_MESSAGE } from '@app/shared';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  usersList: User[] = [];

  private roomId: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private agoraService: AgoraService
  ) { }

  ngOnInit() {
    forkJoin([
      this.activatedRoute.params.pipe(take(1)),
      this.activatedRoute.queryParams.pipe(take(1))
    ]).subscribe(async ([params, queryParams]) => {
      // get local stream : localUserJoined.subscribe()
      this.agoraService.localUserJoined.subscribe(( user ) => {
        this.usersList.push(user);
      });

      // join a call:  join(channel, mode, name)
      const { id } = params;
      const { user, mode } = queryParams;
      await this.agoraService.joinChannel(id, mode, user);
      
      this.roomId = id;

      // receive other participants: 
      //    remoteUserJoined
      this.agoraService.remoteUserJoined.subscribe((remoteUser) => {
        this.usersList.push(remoteUser as any);
      });
      //    remoteUserLeft
      this.agoraService.remoteUserLeft.subscribe((remoteUser) => {
        const userIndex = this.usersList.findIndex(u => u.uid === remoteUser.uid);

        if (userIndex >= 0)
          this.usersList.splice(userIndex, 1);
      });
      //    remoteUserStatusChanged
      this.agoraService.remoteUserStatusChanged.subscribe((remoteUser) => {
        const userIndex = this.usersList.findIndex(u => u.uid === remoteUser.uid);
  
        if (userIndex >= 0)
          this.usersList[userIndex] = remoteUser as any;
        else
          this.usersList.push(remoteUser as any);
      });
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });

    this.leave();
  }

  toggleMicrophone(status: boolean) {
    status ? this.agoraService.unmuteMicrophone() 
      : this.agoraService.muteMicrophone();
  }

  toggleCamera(status: boolean) {
    status ? this.agoraService.cameraOn() 
      : this.agoraService.cameraOff();
  }

  toggleScreenSharing(status: boolean) {
    status ? this.agoraService.shareScreen()
      : this.agoraService.stopScreenSharing();
  }

  leave() {
    this.agoraService.leaveChannel();
    this.usersList.splice(0, this.usersList.length);
    this.router.navigate(['/'], { replaceUrl: true });
  }

  shareRoomLink() {
    const link = `${location.origin}/join?room=${this.roomId}`;
    this.clipboard.copy(link);

    this.snackBar.open(SHARE_LINK_MESSAGE, null, { 
      duration: 3000, panelClass: 'room-snackbar'
    });
  }

}
