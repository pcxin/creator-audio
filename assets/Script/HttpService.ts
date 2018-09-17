

export default class HttpService {
    public static readonly instance = new HttpService();
    private constructor() { }
    get userinfo(): any {
        console.log(SDKManager.phoneType);
        return { id: 2 };
    }
}