import { IMediaTrack, IRemoteAudioTrack, IRemoteVideoTrack } from "ngx-agora-sdk-ng";

export class User {
    type: 'local' | 'remote';
    uid: string;
    displayName?: string;
    mediaTrack?: IMediaTrack;
    audioTrack?: IRemoteAudioTrack;
    videoTrack?: IRemoteVideoTrack; 
}