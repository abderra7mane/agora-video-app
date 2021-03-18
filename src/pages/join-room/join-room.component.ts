import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CallService, MediaService } from '@app/services';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  @ViewChild('cameraPreview', { static: true })
  private cameraPreview: ElementRef<HTMLVideoElement>;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router, 
    private callService: CallService,
    private mediaService: MediaService
  ) { }

  ngOnInit() {
    const mediaStreamSub = this.mediaService.mediaStream().subscribe((stream) => {
      this.cameraPreview.nativeElement.srcObject = stream;
    });

    this.subscriptions.push(mediaStreamSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  joinRoom(form: NgForm) {
    if (form.invalid)
      return;

    const { roomId, displayName } = form.value;
    this.callService.displayName = displayName;

    this.router.navigate(['/room', roomId]);
  }

}
