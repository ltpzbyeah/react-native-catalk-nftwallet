import {Alert, NativeModules,} from "react-native";
import nwApi from "./nftWalletApi";
import NWException from "./NWExceeption";


async function refeshIntent() {
    NativeModules.LinkingCustom.refreshIntent().then((Intent: any) => {
        return Intent;
    });
}

function handleIntent() {
    try {
        let handleResult = nwApi.handleIntent();
        if (handleResult) {
            return handleResult.serial, handleResult.auth_code;
        }
    } catch (e) {
        if (e instanceof NWException) {
            Alert.alert("数盒授权错误");
        } else {
            Alert.alert("处理回调错误");
        }
    }
}

// @ts-ignore
async function requestGrant() {
    try {
        let fields = ["phone", "real_name", "address"]; //这里可以根据自身业务情况来调整后端需要获取的额外用户信息 phone手机号, real_name真实姓名, address对应链的链地址
        let custom = ""; //这里可以调整需要传递给后端的自定义信息, 比如是否注册,用户ID等, 方便后端在获取用户信息后决定怎么处理
        await nwApi.requestGrant(fields, custom);
    } catch (e) {
        if (e instanceof NWException) {
            if (e.code === "1006") {

                {
                    return;
                }
            }
            Alert.alert("发起授权出错:" + e.message);
        }
    }
}

export const startLink = {
    handleIntent,
    requestGrant,
    refeshIntent,
}
