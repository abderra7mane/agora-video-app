import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaService } from '@app/services';


@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss']
})
export class CameraPreviewComponent implements OnInit {

  @ViewChild('cameraPreview', { static: true })
  private cameraPreview: ElementRef<HTMLVideoElement>;

  private subscriptions: Subscription[] = [];

  constructor(private mediaService: MediaService) { }

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

}
