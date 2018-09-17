import App from "./App";
import AudioMgr, { AudioId } from "./AudioMgr";
import Global from "./Global";
import SDKManager from "./SDKManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {
    @property({ type: cc.AudioClip }) bg2: cc.AudioClip = null;
    @property(cc.Toggle) toggleAudioBg: cc.Toggle = null;;
    @property(cc.Toggle) toggleAudioSfx: cc.Toggle = null;

    @property(cc.Slider) sliderAudioBg: cc.Slider = null;;
    @property(cc.Slider) sliderAudioSfx: cc.Slider = null;

    onLoad() {
        (<any>window).SDKManager = SDKManager; // SDKManager 全局不引用注册
        App.instance; // 初始化  App 全局类

        AudioMgr.instance.playBGM(); // play bg

        // 添加事件
        Global.addBtnEvent(this, this.node.children[0], this.btnClick);  // 有音效按钮点击
        Global.addBtnEvent(this, this.node.children[1], this.btnClick, 1, true);
        Global.addBtnEvent(this, this.node.children[2], this.btnClick, 2);
        Global.addBtnEvent(this, this.node.children[3], this.btnClick);
        Global.addBtnEvent(this, this.node.children[4], this.btnClick, null, false); // 无音效按钮

        Global.addToggleEvent(this, this.toggleAudioBg, this.toggle, 1);
        Global.addToggleEvent(this, this.toggleAudioSfx, this.toggle, 2);

        // 控件事件
        this.sliderAudioBg.handle.node.on('position-changed', e => {
            this.updateAudioVolume(this.sliderAudioBg.progress, 1);
        }, this);
        this.sliderAudioSfx.handle.node.on('position-changed', e => {
            this.updateAudioVolume(this.sliderAudioSfx.progress, 2);
        }, this);
    }

    private btnClick(e, data) {
        if (data === 1 || data === 2) { // 使用data 区分
            AudioMgr.instance.playBGM(data === 1 ? this.bg2 : AudioId.bg);
            return;
        }
        let name = (<cc.Button>e.detail).node.name; // 使用name区分
        switch (name) {
            case this.node.children[0].name: // 点击按钮
            case this.node.children[4].name: // 无音效按钮
                console.log('btn click');
                break;
            case this.node.children[3].name:
                ////////  这种播放 不建议使用 如果直接在脚本上还要获取才能进行控制音量  而且每次设置音量必须重新播放才生效
                cc.audioEngine.stopMusic();
                let a = this.node.getComponent(cc.AudioSource);
                a.volume = AudioMgr.instance.mBgmVolume;
                // let v = a.play(); // 竟然返回void
                let v = a.resume(); // 竟然返回void
                console.log("Volume:", v);
                break;
        }
    }
    private toggle(e, data) {
        if (data === 1) {
            this.sliderAudioBg.progress = this.toggleAudioBg.isChecked ? 1 : 0;
        } else if (data === 2) {
            this.sliderAudioSfx.progress = this.toggleAudioSfx.isChecked ? 1 : 0;
        }
    }
    start() {
        this.sliderAudioBg.progress = AudioMgr.instance.mBgmVolume;
        this.sliderAudioSfx.progress = AudioMgr.instance.mSfxVolume;
    }
    private updateAudioVolume(progress: number, type: number) {//type[1:音乐  2:音效]
        if (type === 1) {
            AudioMgr.instance.setBGMVolume(progress);
            this.toggleAudioBg.isChecked = !!progress;
        }
        else if (type === 2) {
            AudioMgr.instance.setSFXVolume(progress);
            this.toggleAudioSfx.isChecked = !!progress;
        }
        this.ShowAudioAlert();
    }

    private isShowisSupportAudio = false;
    private ShowAudioAlert() {
        if (!this.isShowisSupportAudio && !AudioMgr.instance.isSupportAudio()) {
            this.isShowisSupportAudio = true;
            // if (cc.sys.isBrowser)
            //     Global.Alert("您的浏览器版本过低或者游戏暂不支持播放音频，是否要跳转到更新浏览器详细页面？", e => {
            //         window.location.href = "unh5.html";
            //     });
        }
    }
}