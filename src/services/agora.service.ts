import { EventEmitter, Injectable } from "@angular/core";
import AgoraRTC, { 
    ClientConfig, ClientRole, IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalAudioTrack, 
    ILocalVideoTrack, IRemoteAudioTrack, IRemoteVideoTrack, SDK_CODEC, SDK_MODE, UID 
} from 'agora-rtc-sdk-ng';
import { AGORA_APP_ID, uuid } from "@app/shared";

export class User {
    type: 'local' | 'remote';
    uid: UID;
    displayName?: string;
    isSpectator?: boolean;
    audioTrack?: ILocalAudioTrack | IRemoteAudioTrack;
    videoTrack?: ILocalVideoTrack | IRemoteVideoTrack;
}

export type UserJoinMode = 'participant' | 'spectator';

@Injectable({
    providedIn: 'root'
})
export class AgoraService {

    private client: IAgoraRTCClient;

    private mode: UserJoinMode;

    private audioTrack: ILocalAudioTrack;
    private videoTrack: ILocalVideoTrack;
    private screenTrack: ILocalVideoTrack;

    private localUserJoinedEvent = new EventEmitter<User>();
    localUserJoined = this.localUserJoinedEvent.asObservable();

    private remoteUserJoinedEvent = new EventEmitter<User>();
    remoteUserJoined = this.remoteUserJoinedEvent.asObservable();

    private remoteUserLeftEvent = new EventEmitter<User>();
    remoteUserLeft = this.remoteUserLeftEvent.asObservable();

    private remoteUserStatusChangedEvent = new EventEmitter<User>();
    remoteUserStatusChanged = this.remoteUserStatusChangedEvent.asObservable();

    constructor() {
        // 2: Warning
        AgoraRTC.setLogLevel(2);
    }

    /**
     * Join the channel specified by the given parameter.
     * if `mode` is set to 'participant' (default), user feed from camera/microphone
     * is shared with the rest of the users, otherwise - as a 'spectator' - the user 
     * feed in not shared.
     * 
     * @param channel The channel name
     * @param mode Joining mode: 'participant' (default) or 'spectator'
     * @param displayName The user name
     */
    async joinChannel(channel: string, mode?: UserJoinMode, displayName?: string) {
        if (this.isConnected())
            throw new Error('Client is already connected');

        mode = mode || 'participant';
        displayName = displayName || 'Me';

        // 1. initialize client
        this.client = this.createClient(mode);
        this.mode = mode;

        // 2. join channel
        const uid = uuid();
        await this.client.join(AGORA_APP_ID, channel, null, uid);
        
        // 3. build and publish tracks
        if (!this.isSpectator()) {
            await this.publishTracks();
            
            this.localUserJoinedEvent.emit({
                type: 'local',
                uid, displayName,
                isSpectator: false,
                videoTrack: this.videoTrack 
            });
        }
        else {
            this.localUserJoinedEvent.emit({
                type: 'local',
                uid, displayName,
                isSpectator: true
            });
        }
        
        // 4. listen for events
        this.setupEventListeners();

        // 5. subscribe to existing users
        this.subscribeToExistingUsers();
    }

    private createClient(joinMode: UserJoinMode, codec: SDK_CODEC = 'h264') {
        const mode: SDK_MODE = joinMode === 'spectator' ? 'live' : 'rtc';
        const role: ClientRole = joinMode === 'spectator' ? 'audience' : 'host';
        const clientConfig: ClientConfig = { codec, mode, role };
        
        return AgoraRTC.createClient(clientConfig);
    }

    private async publishTracks() {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        if (this.isSpectator())
            throw new Error('Cannot publish in spectator mode');

        this.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        this.videoTrack = await AgoraRTC.createCameraVideoTrack();

        await this.client.publish([this.audioTrack, this.videoTrack]);
    }

    private isSpectator() {
        return this.mode === 'spectator';
    }

    private isConnected() {
        return this.client && this.client.connectionState === 'CONNECTED';
    }

    private subscribeToExistingUsers() {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        this.client.remoteUsers.forEach(async (remoteUser) => {
            if (remoteUser.hasAudio)
                await this.client.subscribe(remoteUser, 'audio');
            
            if (remoteUser.hasVideo)
                await this.client.subscribe(remoteUser, 'video');
            
            this.remoteUserJoinedEvent.emit({
                type: 'remote',
                uid: remoteUser.uid,
                displayName: remoteUser.uid.toString(),
                audioTrack: remoteUser.audioTrack,
                videoTrack: remoteUser.videoTrack
            });
        });
    }

    private setupEventListeners() {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        this.client.on('user-joined', 
            this.remoteUserJoinedHandler.bind(this));
        this.client.on('user-left', 
            this.remoteUserLeftHandler.bind(this));

        this.client.on('user-published',
            this.remoteUserPublished.bind(this));
        this.client.on('user-unpublished',
            this.remoteUserUnpublished.bind(this));
    }

    private remoteUserJoinedHandler(remoteUser: IAgoraRTCRemoteUser) {
        this.remoteUserJoinedEvent.emit({
            type: 'remote',
            uid: remoteUser.uid,
            displayName: remoteUser.uid.toString(),
            audioTrack: remoteUser.audioTrack,
            videoTrack: remoteUser.videoTrack
        });
    }

    private remoteUserLeftHandler(remoteUser: IAgoraRTCRemoteUser) {
        this.remoteUserLeftEvent.emit({ type: 'remote', uid: remoteUser.uid });
    }

    private async remoteUserPublished(remoteUser: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') {
        await this.client.subscribe(remoteUser, mediaType);
        
        this.remoteUserStatusChangedEvent.emit({
            type: 'remote',
            uid: remoteUser.uid,
            displayName: remoteUser.uid.toString(),
            audioTrack: remoteUser.audioTrack,
            videoTrack: remoteUser.videoTrack
        });
    }

    private async remoteUserUnpublished(remoteUser: IAgoraRTCRemoteUser) {
        this.remoteUserStatusChangedEvent.emit({
            type: 'remote',
            uid: remoteUser.uid,
            displayName: remoteUser.uid.toString(),
            audioTrack: remoteUser.audioTrack,
            videoTrack: remoteUser.videoTrack
        });
    }

    cameraOn() {
        this.setCameraStatus(true);
    }

    cameraOff() {
        this.setCameraStatus(false);
    }

    private setCameraStatus(status: boolean) {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        if (this.isSpectator())
            throw new Error('Cannot change camera status in spectator mode');

        this.videoTrack.setEnabled(status);
    }

    muteMicrophone() {
        this.setMicrophoneStatus(false);
    }

    unmuteMicrophone() {
        this.setMicrophoneStatus(true);
    }

    private setMicrophoneStatus(status: boolean) {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        if (this.isSpectator())
            throw new Error('Cannot change microphone status in spectator mode');

        this.audioTrack.setEnabled(status);
    }

    async shareScreen() {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        if (this.isSpectator())
            throw new Error('Cannot share screen in spectator mode');

        this.screenTrack = await AgoraRTC.createScreenVideoTrack({}, "disable");
        this.screenTrack.on('track-ended', async () => {
            await this.client.unpublish(this.screenTrack);
            await this.client.publish(this.videoTrack);
    
            this.screenTrack.close();
        });
        
        await this.client.unpublish(this.videoTrack);
        await this.client.publish(this.screenTrack);
    }

    async stopScreenSharing() {
        if (!this.isConnected())
            throw new Error('Client is not connected');

        if (this.isSpectator())
            throw new Error('Cannot share screen in spectator mode');

        await this.client.unpublish(this.screenTrack);
        await this.client.publish(this.videoTrack);

        this.screenTrack.close();
    }

    async leaveChannel() {
        this.audioTrack?.close();
        this.videoTrack?.close();
        await this.client?.leave();
    }

}