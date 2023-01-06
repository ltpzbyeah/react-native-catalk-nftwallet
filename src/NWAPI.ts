import NWException from './NWExceeption';
import {Linking, NativeModules, Platform} from 'react-native';

let platform = Platform.OS;
let REGISTER_URL = '';
let DOWNLOAD_URL = '';
let BASEURL = '';
const DEVELOP_BASEURL = 'https://test.nft-wallet.cn/openAuth';
const PRODUCT_BASEURL = 'https://api2.nft-wallet.cn/openAuth';
const DEVELOP_REGISTER_BASEURL = `https://test1.nft-wallet.cn/#/pages/signUp/signUp?from=${platform}&invite=`;
const PRODUCT_REGISTER_BASEURL = `https://wx.nft-wallet.cn/#/pages/signUp/signUp?from=${platform}&invite=`;
const DEVELOP_DOWNLOAD_URL =
    'https://download.nft-wallet.cn/download/test.html?auto=true';
const PRODUCT_DOWNLOAD_URL =
    'https://download.nft-wallet.cn/download/index.html?auto=true';

export default class NWAPI {
    appKey: string;
    chainId: number;
    inviteCode: string;
    platform: any;
    redirect: any;
    processedIntent: any;

    _handleOpenURL: any;
    ERROR_MODE = 1000; //未实现对应接口
    ERROR_REQUEST = 1001; //HTTP请求出错
    ERROR_JSON = 1002; //JSON错误
    ERROR_SERVER_CODE = 1003; //服务器返回错误
    ERROR_CLIENT_CODE = 1004; //用户返回错误
    ERROR_DECODE = 1005; //公钥解码错误
    ERROR_NOT_INSTALLED = 1006; //数盒APP未安装
    ERROR_REJECTED = 1009; //用户拒绝授权

    constructor(
        appKey: string,
        chainId: number,
        inviteCode: string,
        redirect: string,
    ) {
        this.appKey = appKey;
        this.chainId = chainId;
        this.inviteCode = inviteCode;
        this.platform = Platform.OS; //获取平台
        this.redirect = redirect;
        if (this.platform === 'android') {
            if (!this.redirect) {
                NativeModules.LinkingCustom.getName().then((packageName: any) => {
                    this.redirect = packageName.packageName;
                });
            }
        }
        this.processedIntent = undefined;
        this.setDevelop(false); //设置正式版本
    }

    setDevelop(develop: boolean) {
        //设置开发版本
        BASEURL = develop ? DEVELOP_BASEURL : PRODUCT_BASEURL;
        REGISTER_URL = develop
            ? DEVELOP_REGISTER_BASEURL + this.inviteCode
            : PRODUCT_REGISTER_BASEURL + this.inviteCode;
        DOWNLOAD_URL = develop ? DEVELOP_DOWNLOAD_URL : PRODUCT_DOWNLOAD_URL;
    }

    checkNftWalletInstalled() {
        //检查数盒APP安装情况
        // 在调起其他app或者本机应用前先检查是否已经安装：
        return Linking.canOpenURL('nft-wallet-cn://openAuth?');
    }

    requestGrant(fields: any, custom: string) {
        if (Array.isArray(fields)) {
            fields = fields.join(',');
        }
        if (!this.checkNftWalletInstalled()) {
            throw new NWException('数盒未安装', this.ERROR_NOT_INSTALLED);
        }
        let url = 'nft-wallet-cn://openAuth?';

        let params = [
            `openAuthInvite=${encodeURIComponent(this.inviteCode)}`,
            `openAuthRedirect=${encodeURIComponent(this.redirect)}`,
            `openAuthChainId=${encodeURIComponent(this.chainId)}`,
            `openAuthAppKey=${encodeURIComponent(this.appKey)}`,
            `openAuthFields=${encodeURIComponent(fields ? fields : '')}`,
            `openAuthCustom=${encodeURIComponent(custom ? custom : '')}`,
            `openAuthTimestamp=${encodeURIComponent(
                Math.floor(new Date().getTime() / 1000).toString(),
            )}`,
        ];
        let uri = url + params.join('&');
        Linking.openURL(uri);

    }

    webRegister() {
        Linking.openURL(REGISTER_URL);
    }

    webDownload() {
        Linking.openURL(DOWNLOAD_URL);
    }

    handleIntent() {
        let intent;
        if (intent !== this.processedIntent) {
            this.processedIntent = intent;

            if (typeof intent === 'string') {
                let intentJSON;
                if (this.platform === 'ios') {
                    if (intent.indexOf(this.redirect) === 0) {
                        let url;
                        try {
                            url = new URL(intent);
                        } catch (e) {
                            console.error(e);
                            return false;
                        }
                        intentJSON = {};
                        url.searchParams.forEach((value, key) => (intentJSON[key] = value));
                    } else {
                        return false;
                    }
                } else if (this.platform === 'android') {
                    try {
                        intentJSON = JSON.parse(intent);
                    } catch (e) {
                        console.error(e);
                        return false;
                    }
                }
                if (intentJSON.nftWalletCallback === 'OpenAuth') {
                    console.log('plus.runtime.arguments = undefined');
                    if (intentJSON.nftWalletAuthFailed === 'true') {
                        throw new NWException('授权被拒绝', this.ERROR_REJECTED, intent);
                    } else if (intentJSON.nftWalletAuthFailed === 'false') {
                        if (intentJSON.nftWalletCallback === 'OpenAuth') {
                            return {
                                method: intentJSON.nftWalletCallback,
                                serial: intentJSON.nftWalletAuthSerial,
                                auth_code: intentJSON.nftWalletAuthCode,
                            };
                        } else {
                            throw new NWException('授权类型未支持', this.ERROR_MODE, intent);
                        }
                    } else {
                        throw new NWException(
                            '授权返回数据错误',
                            this.ERROR_CLIENT_CODE,
                            intent,
                        );
                    }
                }
            }
        }
        return false;
    }
}
