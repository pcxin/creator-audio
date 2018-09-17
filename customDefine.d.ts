/** customDefine.d.ts 声明定义文件 */
declare let gl: any;

declare class User {
	id;
}

/**
 * sdk 管理类
 */
declare class SDKManager {
	//////////////////// 去native层 ////////////////////
	/** 微信分享 @param isFriend @param screen  @param title  @param content  */
	static wechatShare(isFriend?: boolean, screen?: boolean, title?: string, content?: string, url?: string);
	/** 支付 @param data  */
	static pay(data);
	static init();
	static get phoneType(): number;
}