/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from "react";
import {
    Alert,
    AppState,
    AppStateStatus,
    Button,
    Linking,
    NativeModules,
    SafeAreaView, Text,
    useColorScheme,
    View,
} from "react-native";
import nwApi from "./nftWalletApi";
import {getIntent} from "react-native-get-intent";
import NWException from "./NWExceeption";

export default class Catalk {
    refeshIntent() {
        NativeModules.LinkingCustom.refreshIntent().then((Intent: any) => {
            console.log("Intent:", Intent);
        });
    }

    handleIntent() {
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
    async requestGrant() {
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
};
