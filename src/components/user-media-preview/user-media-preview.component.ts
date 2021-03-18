import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '@app/shared';
import { MediaService } from '@app/services';


@Component({
  selector: 'app-user-media-preview',
  templateUrl: './user-media-preview.component.html',
  styleUrls: ['./user-media-preview.component.scss']
})
export class UserMediaPreviewComponent implements OnInit {

  @Input() user: User;

  @ViewChild('videoWrapper') videoWrapper: ElementRef<HTMLElement>;

  constructor(private mediaService: MediaService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.user.mediaTrack)
      this.user.mediaTrack.playVideo(this.videoWrapper.nativeElement);

    if (this.user.videoTrack)
      this.user.videoTrack.play(this.videoWrapper.nativeElement);
    
    if (this.user.audioTrack)
      this.user.audioTrack.play();
  }

}
