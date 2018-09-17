/**
 * 全局工具类 在Login.ts Onload中注册了 可以直接使用 SDKManager.xxxx 访问
 * 如果有添加 直接到customDefine.d.ts中注册一下进行支持提示
 */
export default class SDKManager {
    static wechatShare(isFriend?: boolean, screen?: boolean, title?: string, content?: string, url?: string) {

    }
    /** 支付 @param data  */
    static pay(data) {

    }
    static init() {

    }
    static get phoneType(): number {
        if (cc.sys.isBrowser) { //  0:网页 1:andiord网页 2:ios网页 3：andiord  4:ios  5：其他 6微信小程序
            if (cc.sys.os == cc.sys.OS_ANDROID) return 1;
            else if (cc.sys.os == cc.sys.OS_IOS) return 2;
            else return 0;
        } else {
            if (cc.sys.os == cc.sys.OS_ANDROID) return 3;
            else if (cc.sys.os == cc.sys.OS_IOS) return 4;
            else if (cc.sys.os == cc.sys.BROWSER_TYPE_WECHAT_GAME) return 6;
            else if (cc.sys.platform == cc.sys.WECHAT_GAME) return 6;
            else return 5;
        }
    }
}