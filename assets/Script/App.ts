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
