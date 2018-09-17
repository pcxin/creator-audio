import AudioMgr, { AudioId } from "./AudioMgr";

/**
 * 全局工具类 在Login.ts Onload中注册了 可以直接使用 Global.xxxx 访问
 * 如果有添加 直接到customDefine.d.ts中注册一下进行支持提示
 */
export default class Global {
    static cnNum: string[] = ["0", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    static HeadAtlas: cc.SpriteAtlas;
    /** 进行排序 支持数字、字符串、User 和 cc.Node 根据数字正排或者倒序 默认正序*/
    static sort(numList, reverse?: boolean) {
        numList.sort((a, b) => {
            let ac = 0, bc = 0;
            if (a instanceof User) {
                ac = a.id;
                bc = b.id;
            } else {
                ac = typeof a === "number" ? a : parseInt(typeof a === "string" ? a : (a instanceof cc.Node ? a.name : a));
                bc = typeof b === "number" ? b : parseInt(typeof b === "string" ? b : (b instanceof cc.Node ? b.name : b));
            }
            if (ac > bc) return reverse ? -1 : 1; // 如果是降序排序，返回-1。
            else if (ac == bc) return 0;
            else return reverse ? 1 : -1; // 如果是降序排序，返回1。
        });
    }

    /** 支持 1-99 @param n 数值 */
    static numToChiness(n?: number): string {
        if (n > 0 && n <= 10) return Global.cnNum[n];
        if (n > 10) {
            let geWei: number = n % 10;
            let shiWei: number = Math.floor(n / 10);
            return (shiWei > 1 ? Global.cnNum[shiWei] : "") + Global.cnNum[10] + (geWei > 0 ? Global.cnNum[geWei] : "");
        }
        return "0";
    }

    /** 截取数值后缀 字 向下取整 */
    static toNumShort(n: number): string {
        // 进行计算整数值会计算成浮点0.99999999999999近似值1表示
        if (n >= 100000000) return Math.floor((n / 99999999.9) * 10) / 10 + "亿"; // 保留一位小数 
        if (n >= 10000) return Math.floor((n / 9999.9) * 100) / 100 + "万"; // 大于1万才进行取整 保留二位小数
        return n + "";
    }

    /** 进行设置点击音效 */
    private static async playBtnClickAudio() {
        // let id = await AudioMgr.instance.playSFX("btnSound");
        let id = await AudioMgr.instance.playSFXById(AudioId.btnSound);
    }
    /** 添加统一按钮点击事件 @param _this @param btn  @param fun  */
    static addBtnEvent(_this: any, btn?: cc.Button | any, fun?: Function, data?: any, isPlayAudio: boolean = true) {
        if (!_this || !btn) { // 如果有一项为空的情况
            console.warn("addBtnEvent:", _this, btn, fun, data, isPlayAudio);
            return;
        }
        // if(btn.getOn("click")) 没法检查到on 里面的 click add 是否有事件
        if (!(btn instanceof cc.Button) && !btn.getComponent(cc.Button)) btn.addComponent(cc.Button); // 如果不是按钮的话进行添加按钮组件
        (btn instanceof cc.Node ? btn : btn.node).on("click", e => {
            if (fun) fun.call(_this, e, data);
            if (isPlayAudio) Global.playBtnClickAudio();
        }, _this);
    }
    static removeBtnEvent(_this: any, btn?: cc.Button | any, fun?: Function, data?: any, isPlayAudio: boolean = true) {
        if (!_this || !btn) { // 如果有一项为空的情况
            console.warn("addBtnEvent:", _this, btn, fun, data, isPlayAudio);
            return;
        }
        // if(btn.getOn("click")) 没法检查到on 里面的 click add 是否有事件
        if (!(btn instanceof cc.Button) && !btn.getComponent(cc.Button)) btn.addComponent(cc.Button); // 如果不是按钮的话进行添加按钮组件
        (btn instanceof cc.Node ? btn : btn.node).off("click", e => {
            if (fun) fun.call(_this, e, data);
            // if (isPlayAudio) Global.playBtnClickAudio();
        }, _this);
    }
    /** 添加统一按钮点击事件 @param _this @param btn  @param fun  */
    static addToggleEvent(_this: any, toggle?: cc.Toggle | any, fun?: Function, data?: any, isPlayAudio: boolean = true) {
        if (!_this || !toggle) { // 如果有一项为空的情况
            console.warn("addBtnEvent:", _this, toggle, fun, data, isPlayAudio);
            return;
        }
        // if(btn.getOn("click")) 没法检查到on 里面的 click add 是否有事件
        if (!(toggle instanceof cc.Toggle) && !toggle.getComponent(cc.Toggle)) toggle.addComponent(cc.Toggle); // 如果不是按钮的话进行添加按钮组件
        (toggle instanceof cc.Node ? toggle : toggle.node).on("toggle", e => {
            if (fun) fun.call(_this, e, data);
            if (isPlayAudio) Global.playBtnClickAudio();
        }, _this);
    }

    static addClickEvent(node: cc.Node, target: cc.Node, component: string, handler: string, data?: any) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    }

    /**
     * 获取类名
     * @param c
     */
    static getClassName(c: any): string {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(c.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }
    /**
     * yyyy-MM-dd HH:mm:ss
     */
    static getCurrentTime() {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let currentdate = date.getFullYear() + seperator1 + ((month >= 1 && month <= 9) ? "0" : "") + month + seperator1 + ((strDate >= 0 && strDate <= 9) ? "0" : "") + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    /** 根据时分秒获取时间差 获取HH:mm:ss 如果没有小时的话默认mm:ss fixed冒号直接加缀 */
    static getHHmmss(time?: number, isHh?, fixed = ""): string {
        if (!time || time <= 0) return "00:00";
        if (time > 239711525) { // 1977/8/6 18:32:5 设置大一点表示时间戳进行转换
            if (time.toString().length <= 11) time *= 1000;
            var date = new Date(time);//直接用 new Date(时间戳) 格式转化获得当前时间
            let r: string = "";
            let h = date.getHours(); // 60*60 1个小时
            let m = date.getMinutes();
            let s = date.getSeconds();
            // console.log("dddd", date.toLocaleDateString() + " " + date.toLocaleTimeString());
            if (h > 0) r = (h > 9 ? "" + h : "0" + h) + fixed + ":"; // HH
            else if (isHh) r = "00" + fixed + ":"
            r += (m > 9 ? "" : "0") + m + fixed + ":" + fixed; // mm
            r += (s > 9 ? "" : "0") + s;
            return r;
        }
        let r: string = "";
        let h = Math.floor(time / 3600); // 60*60 1个小时
        let hY = time % 3600;
        let m = Math.floor(hY / 60);
        let s = hY % 60;
        if (h > 0) r = (h > 9 ? "" + h : "0" + h) + fixed + ":"; // HH
        else if (isHh) r = "00" + fixed + ":"
        r += (m > 9 ? "" : "0") + m + fixed + ":" + fixed; // mm
        r += (s > 9 ? "" : "0") + s;
        return r;
    }

    /** 根据年月日时分秒获取时间戳 格式 yyyy-MM-dd HH:mm:ss yyyy/MM/dd HH:mm:ss  */
    static getTimestamp(d, isMillisecond = false) {
        if (d == null) return 0;
        if (typeof d == "number") {
            if (!isMillisecond && d > 10000000000) return d / 1000;
            if (isMillisecond && d < 10000000000) return d * 1000;
            return d;
        }
        if (d == "") return 0;
        if (d.indexOf("/") == -1 && d.indexOf("-") == -1) return 0; // 必须包含年月日 时  时可以没有 但是必须有 空格
        let ttt = new Date((d).replace(new RegExp("-", "gm"), "/")).getTime();
        return isMillisecond ? ttt : ttt / 1000;
    }

    /** 重写/照抄引擎方法 Scene 添加进度方法 */
    static preloadScene(_This, sceneName, onLoaded?, onProgress?) {
        let director: any = cc.director;
        let info = director._getSceneUuid(sceneName);
        if (info) {
            director.emit((<any>cc.Director).EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({ uuid: info.uuid, type: 'uuid' }, onProgress == null ? null : function (e, a) {
                if (onProgress) onProgress.call(_This, e, a);
            }, function (error, asset) {
                if (error) {
                    (<any>cc).errorID(1210, sceneName, error.message);
                }
                if (onLoaded) {
                    onLoaded(error, asset);
                    (<any>cc.loader).onProgress = null;
                }
            });
        }
        else {
            var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
            if (onLoaded) onLoaded(new Error(error));
            cc.error('preloadScene: ' + error);
        }
    }

    static setSpriteImg(node, remoteUrl) {
        if (remoteUrl != null && typeof remoteUrl == "string" && (remoteUrl.toLowerCase().indexOf(".jpg") != -1 || remoteUrl.toLowerCase().indexOf(".png") != -1 || remoteUrl.toLowerCase().indexOf(".jpeg") != -1)) {

        } else {
            console.log("load img err", remoteUrl);
            return;
        }

        let sp = null;
        if (node instanceof cc.Sprite) {
            sp = node;
        } else if (node instanceof cc.Node) {
            sp = node.getComponent(cc.Sprite);
            !sp && (sp = node.addComponent(cc.Sprite));
        }
        sp.type = cc.Sprite.Type.SIMPLE;
        cc.loader.load(remoteUrl, (err, texture) => {
            // Use texture to create sprite frame
            if (!err) {
                console.log("load img ok");
                sp.spriteFrame = new cc.SpriteFrame();
                texture && sp && sp.spriteFrame.setTexture(texture);
            } else {
                cc.log("load img fail, 加载失败", err);
            }
        });
    }

    /** 设置头像或者是url头像 */
    static setNodeOrSpriteImg(node, remoteUrl, headId = 0) {
        // // 远程 url 带图片后缀名
        let sp = null;
        if (node instanceof cc.Sprite) {
            sp = node;
        } else if (node instanceof cc.Node) {
            sp = node.getComponent(cc.Sprite);
            !sp && (sp = node.addComponent(cc.Sprite));
        }
        sp.type = cc.Sprite.Type.SIMPLE;
        if (remoteUrl != null && typeof remoteUrl == "string" && (remoteUrl.toLowerCase().indexOf(".jpg") != -1 || remoteUrl.toLowerCase().indexOf(".png") != -1)) {
            Global.setSpriteImg(node, remoteUrl);
        } else {
            if (typeof remoteUrl == "number" && remoteUrl >= 0) headId = remoteUrl;
            sp.spriteFrame = new cc.SpriteFrame();
            sp && (sp.spriteFrame = Global.HeadAtlas.getSpriteFrame("ava_" + headId));
        }
    }
}