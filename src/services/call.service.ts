import { Injectable } from '@angular/core';
import { IMediaTrack, IRemoteUser, NgxAgoraSdkNgService } from 'ngx-agora-sdk-ng';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AGORA_APP_TOKEN, User, uuid } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  userId: string = uuid();

  displayName: string;

  private _userMediaTrackSubject = new BehaviorSubject<IMediaTrack>(null);
  userMediaTrack = this._userMediaTrackSubject.asObservable();

  private _remoteUsers: User[] = [];
  get remoteUsers() { return this._remoteUsers };

  private susbscriptions: Subscription[] = [];

  constructor(private agoraService: NgxAgoraSdkNgService) {}

  /**
   * Join a channel.
   * 
   * @param channel channel id
   * @returns a Promise that resolves to the local user media track.
   */
  joinChannel(channel: string) {
    return this.agoraService.join(channel, AGORA_APP_TOKEN, this.userId)
      .WithCameraAndMicrophone(null, null)
      .Apply()
      .then(this.handleLocalUserMediaTrack.bind(this))
      .then(this.setupRemoteUsersListeners.bind(this));
  }

  private handleLocalUserMediaTrack(track: IMediaTrack) {
    this._userMediaTrackSubject.next(track);
  }

  private setupRemoteUsersListeners() {
    const userLeftSubs = this.agoraService.onRemoteUserLeft()
      .subscribe((remoteUser) => {
        this.removeUser(remoteUser.user);
      });
    this.susbscriptions.push(userLeftSubs);
    
    const userStatusChangeSubs = this.agoraService.onRemoteUsersStatusChange()
      .subscribe((userState) => {
        this.addOrUpdateRemoteUser(userState.user);
      });
    this.susbscriptions.push(userStatusChangeSubs);
  }

  private addOrUpdateRemoteUser(remoteUser: IRemoteUser) {
    const userIndex = this.remoteUsers.findIndex(u => u.uid === remoteUser.uid);
    
    if (userIndex === -1) 
      this.addRemoteUser(remoteUser);
    else {
      const currentUser = this.remoteUsers[userIndex];
      this.remoteUsers[userIndex] = {
        ...currentUser,
        audioTrack: remoteUser.hasAudio ? 
          remoteUser.audioTrack : currentUser.audioTrack,
        videoTrack: remoteUser.hasVideo ?
          remoteUser.videoTrack : currentUser.videoTrack
      };
    }
  }

  private addRemoteUser(remoteUser: IRemoteUser) {
    const newUser: User = {
      type: 'remote',
      uid: remoteUser.uid as string,
      displayName: remoteUser.uid as string,
      audioTrack: remoteUser.hasAudio ? remoteUser.audioTrack : null,
      videoTrack: remoteUser.hasVideo ? remoteUser.videoTrack : null,
    };
    this.remoteUsers.push(newUser);
  }

  private removeUser(remoteUser: IRemoteUser) {
    const userIndex = this.remoteUsers.findIndex(
      u => u.uid === remoteUser.uid);
    
    if (userIndex >= 0)
      this.remoteUsers.splice(userIndex, 1);
  }

  /**
   * Leave the currently joined channel.
   */
  leaveChannel() {
    this.agoraService.leave();
    this._userMediaTrackSubject.value?.stop();
    this.remoteUsers.splice(0, this.remoteUsers.length);
  }

}
