import HttpService from "./HttpService";

const { ccclass, property } = cc._decorator;

export enum AudioId {
/** bg*/ bg,
/** bg2*/ bg2,
/** btnSound*/ btnSound,
}
@ccclass
export default class AudioMgr /* extends cc.Component */ {
    public static readonly instance = new AudioMgr();
    private constructor() { }

    private mBgmAudioId = -1; /** 是否第一次播放 播放音乐id*/
    public mBgmVolume = 0.75; // 默认背景声音大小
    public mSfxVolume = 0.75; // 默认音效声音大小
    private uid = 0; // 用户id

    init() {
        this.uid = cc.sys.localStorage.getItem("uid") || 0; // 获取uid 根据每个用户进行定制声音播放情况

        let bv = cc.sys.localStorage.getItem("mBgmVolume" + this.uid);
        if (bv) this.mBgmVolume = parseFloat(bv);
        let bs = cc.sys.localStorage.getItem("mSfxVolume" + this.uid);
        if (bs) this.mSfxVolume = parseFloat(bs);
        console.log("type:", SDKManager.phoneType, "mBgmVolume", bv, this.mBgmVolume, "mSfxVolume:", bs, this.mSfxVolume);
    }
    public lateUpdate() { // 谷歌最新版本 规定不能自动播放 需要用户手动播放 规避这种情况 游戏选择自动播放
        if (cc.sys.isBrowser) {
            let context = (<any>cc.sys).__audioSupport.context;
            if (context.state === 'suspended') { // google chrome latest version need set running 
                context.resume().then(e => {
                    console.log(context.state);
                });
                console.log(context.state);
            }
        }
    }

    public pauseOrResume(isPause?: boolean) {
        isPause ? cc.audioEngine.pauseAll() : cc.audioEngine.resumeAll();
    }

    private getUrl(url: string): string { // 统一获取url
        let addPath = "";
        if (url.indexOf("_") != -1) addPath = "sj/";
        // return cc.url.raw("resources/sounds/" + addPath + url + ".m" + "p3");
        return "sounds/" + addPath + url;
    }

    /** 设置背景音乐 两个参数必须取一个 */
    async playBGM(id: AudioId | string | cc.AudioClip = AudioId.bg) {
        let audioUrl = id instanceof cc.AudioClip ? id : this.getUrl(typeof id == "string" ? id : AudioId[id]);
        console.log(this.mBgmAudioId, audioUrl)
        if (this.mBgmAudioId >= 0) cc.audioEngine.stop(this.mBgmAudioId);
        if (this.mBgmVolume == 0) return;
        if (!this.isSupportAudio()) return; // 不支持播放音乐
        cc.audioEngine.stopAll();//.stopMusic(); // 这里应该放在load的播放前
        this.mBgmAudioId = await this.play(audioUrl, true, this.mBgmVolume); // cc.audioEngine.play(audioUrl, true, this.mBgmVolume);
        console.log(this.mBgmAudioId, audioUrl)
    }
    public isSupportAudio(): boolean {
        if (!cc.sys.isBrowser) return true;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            return true;
        } else {
            if ((<any>cc.sys).__audioSupport.WEB_AUDIO && !((<any>cc.sys).__audioSupport.context && (<any>cc.sys).__audioSupport.context['createGain'])) return false;
            return true;
        }
    }
    /** 根据 AudioId 播放特殊音效 */
    playSFXById(id: AudioId | cc.AudioClip, isMan: boolean = true) {
        // let url = "cc-" + (isMan ? 1 : 0) + "-" + id;
        let audioUrl = id instanceof cc.AudioClip ? id : AudioId[id];
        return this.playSFX(audioUrl);
    }
    /** 根据name */
    async playSFX(url: string | cc.AudioClip) {
        let audioUrl = url instanceof cc.AudioClip ? url : this.getUrl(url);
        // console.log("playSFX:",audioUrl, this.mSfxVolume);
        if (!this.isSupportAudio()) return; // 不支持播放音乐
        if (this.mSfxVolume > 0) return await this.play(audioUrl, false, this.mSfxVolume); // cc.audioEngine.play(audioUrl, false, this.mSfxVolume);
    }

    /** 统一音频播放入口 */
    private async play(url: string | cc.AudioClip, loop, volume): Promise<number | any> {
        return new Promise((resolve, reject) => {
            if (url instanceof cc.AudioClip) {
                let audioID = cc.audioEngine.play(url, loop, volume);
                if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
                // if (this.isFristPlay) {
                //     this.isFristPlay = false;
                // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
                // }
                // console.log("audioID:", audioID);
                resolve(audioID);
                return;
            }
            cc.loader.loadRes(url, cc.AudioClip, (err, clip) => {
                let audioID = cc.audioEngine.play(clip, loop, volume);
                if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
                // if (this.isFristPlay) {
                //     this.isFristPlay = false;
                // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
                // }
                // console.log("audioID:", audioID);
                resolve(audioID);
            });
        });
        // let audioID = cc.audioEngine.play(url, loop, volume);
        // if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
        // // if (this.isFristPlay) {
        // //     this.isFristPlay = false;
        // //     if (audioID != null) this.lateUpdate(); // 还是最好每次检测下为好 
        // // }
        // return audioID;
    }

    setSFXVolume(v: number = 0) {
        if (this.mSfxVolume != v) {
            if (this.uid === 0) HttpService.instance && HttpService.instance.userinfo && (this.uid = HttpService.instance.userinfo.userId); // 如果是新用户进行设置
            cc.sys.localStorage.setItem("mSfxVolume" + this.uid, v); // 用户音频设置记录
            cc.sys.localStorage.setItem("mSfxVolume0", v); // 默认账户记录
            this.mSfxVolume = v;
        }
    }

    setBGMVolume(v: number = 0, isPlay: boolean = true) {
        if (this.uid === 0) HttpService.instance && HttpService.instance.userinfo && (this.uid = HttpService.instance.userinfo.userId); // 如果是新用户进行设置
        if (this.mBgmAudioId > 0) {
            let status: cc.audioEngine.AudioState = cc.audioEngine.getState(this.mBgmAudioId);
            if (v > 0) {
                if (status == cc.audioEngine.AudioState.ERROR) {
                    cc.audioEngine.stop(this.mBgmAudioId);
                    this.mBgmAudioId = -1;
                } else if (status != cc.audioEngine.AudioState.PLAYING)
                    cc.audioEngine.resume(this.mBgmAudioId);
            }
            else {
                if (status != cc.audioEngine.AudioState.PAUSED)
                    cc.audioEngine.pause(this.mBgmAudioId);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if (this.mBgmVolume != v) {
            cc.sys.localStorage.setItem("mBgmVolume" + this.uid, v); // 用户音频设置记录
            cc.sys.localStorage.setItem("mBgmVolume0", v); // 默认账户记录
            this.mBgmVolume = v;
            if (this.mBgmAudioId > 0 && v > 0)
                cc.audioEngine.setVolume(this.mBgmAudioId, v);
            else {
                this.playBGM(AudioId.bg);
            }
            // if(this.mBgmAudioId>0) cc.audioEngine.resume(this.mBgmAudioId);
        }
    }
}