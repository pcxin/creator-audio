# creator-audio
## powered by cocosCreator 
## 1.本例子里面包含各种操作音乐、音效的方法
### 1）代码控制实现类 推荐较灵活
*    1> 播放音乐音效
*    2> 设置音乐、音效播放 音量大小 随当前位置调整
*    3> 更换音乐背景及全局暂停
```
export default class AudioMgr /* extends cc.Component */ {

    init();
    public lateUpdate(); // 谷歌最新版本 规定不能自动播放 需要用户手动播放 规避这种情况 游戏选择自动播放

    public pauseOrResume(isPause?: boolean);

    /** 设置背景音乐 两个参数必须取一个 */
    async playBGM(id: AudioId | string | cc.AudioClip = AudioId.bg);
    public isSupportAudio(): boolean;
    /** 根据 AudioId 播放特殊音效 */
    playSFXById(id: AudioId | cc.AudioClip, isMan: boolean = true);
    /** 根据name */
    async playSFX(url: string | cc.AudioClip);
    /** 统一音频播放入口 */
    private async play(url: string | cc.AudioClip, loop, volume): Promise<number | any>;

    setSFXVolume(v: number = 0;

    setBGMVolume(v: number = 0, isPlay: boolean = true);
}
```
### 2）预设控制音效音乐 （同上）
### 3）audioSource 进行播放 不赞同使用  官方api限制颇多
## 2.本例子里面包含全局变量声明 及全局组件声明
```
import AudioMgr from "./AudioMgr";

const { ccclass, property } = cc._decorator;

/**
 * 全局app类 不随Scene回收
 */
@ccclass
export default class App extends cc.Component {
    private mTime = 0;
    private static _app = null;
    static get instance(): App { // 初始化 并返回App全局类
        if (!this._app) { // 进行初始化node
            this._app = new cc.Node().addComponent(this);
            this._app.node.name = "App";
            cc.game.addPersistRootNode(this._app.node); // 添加全局node
        }

        AudioMgr.instance.init(); // 初始化audio管理类

        return this._app;
    }
    onLoad() {
        console.log("App init............type:", SDKManager.phoneType);
        // 总控制事件-后台前台注册事件
        cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
    }
    onDestroy() {
        // cc.audioEngine.stopAll();
        cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
        console.log("App onDestroy............");
    }
    update(t) {
        if (new Date().getTime() - this.mTime > 300) { // 控制针刷新信息
            this.mTime = new Date().getTime();
            // console.log("App upppppppppppppppp....................");
        }
    }
    private _pausedCallback(e) {
        AudioMgr.instance.pauseOrResume(true);
        console.log("App pause.............");
    }
    private _restoreCallback(e) {
        AudioMgr.instance.pauseOrResume();
        console.log("App resume.............");
    }
}

```
## 3.google chrome latest version need set running 
```
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
```