import NWAPI from './NWAPI'
import {Platform} from "react-native";

// const appKey = "0d4650b728d7448ea133c138af0d8a39"; //替换为自己的APPKEY
// const chainId = 1; //替换为需要对接的链ID
// const inviteCode = "M2IycHU5"; //替换为平台的邀请码
const appKey = "73141f2f09284882b8fecefc0c14f275"; //替换为自己的APPKEY
const chainId = 1; //替换为需要对接的链ID
const inviteCode = "M2IycHM1"; //替换为平台的邀请码
let redirect = undefined;

if(Platform.OS === 'ios') {
	redirect = 'hkuclion-login://nftWallet' //在IOS情况下需要替换为自己的ios url schema(比如这里的hkuclion-login), 其中://后面部分(比如这里的nftWallet)可以改为一个自定义的标识符,不要包含/和?和#, 不要和自己已有的处理的冲突就可以
}

let nwApi = new NWAPI(appKey, chainId, inviteCode, redirect);
nwApi.setDevelop(true); //根据对接的是测试环境还是正式环境, 测试环境为true, 正式环境为false
export default nwApi;
