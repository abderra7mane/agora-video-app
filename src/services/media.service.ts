import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private _mediaStreamSubject: BehaviorSubject<MediaStream>;

  /**
   * Get the local device media stream.
   * 
   * @returns an Observable with Subject as the current
   * device media stream.
   */
  mediaStream(): Observable<MediaStream> {
    if (!this._mediaStreamSubject) {
      this._mediaStreamSubject = new BehaviorSubject<MediaStream>(null);

      // request device access permission
      // on first call.
      this.requestMediaDevice()
        .then(this.handleMediaStream.bind(this))
        .catch(this.handleMediaDeviceError.bind(this));
    }

    return this._mediaStreamSubject.asObservable();
  }

  /**
   * Request access permission to the device's media capabilities (webcam/microphone).
   * 
   * @returns a Promise that resolved to the media stream from the device 
   * or reject if the user denies access permission.
   */
  private requestMediaDevice(): Promise<MediaStream> {
    const cameraMode = 'user';

    const constraints: MediaStreamConstraints = {
      audio: true,
      video: { facingMode: cameraMode }
    };

    if ( navigator.mediaDevices.getUserMedia ) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    const _navigator: any = navigator;

    const getWebcam: typeof navigator.getUserMedia = (
      navigator.getUserMedia || 
      _navigator.webKitGetUserMedia || 
      _navigator.moxGetUserMedia || 
      _navigator.mozGetUserMedia || 
      _navigator.msGetUserMedia
    );

    return new Promise((resolve, reject) => {
      getWebcam(
        {audio: true, video: true}, 
        (stream) => resolve(stream), 
        (error) => reject(error)
      )
    });
  }

  private handleMediaStream(stream: MediaStream) {
    this._mediaStreamSubject.next(stream);
  }

  private handleMediaDeviceError(error) {
    console.log(error);
  }

}
