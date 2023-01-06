
package com.catalk.cc;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;


import java.util.Collections;
import java.util.Set;

public class RNCatalkNftWalletModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNCatalkNftWalletModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNCatalkNftWallet";
    }
    @ReactMethod
    public void getName(Promise promise) {
            final WritableMap name = Arguments.createMap();
            name.putString("packageName", getReactApplicationContext().getPackageName());
            promise.resolve(name);
        }

    public void refreshIntent(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject(new IllegalStateException("getCurrentActivity() returned null"));
            return;
        }
        final Intent intent = activity.getIntent();
        Set<String> categories = intent.getCategories();
        if (categories == null) {
            categories = Collections.emptySet();
        }
        Bundle extras = intent.getExtras();
        if (extras == null) {
            extras = Bundle.EMPTY;
        }
        final WritableMap jsIntent = Arguments.createMap();
        jsIntent.putString("action", intent.getAction());
        jsIntent.putString("data", intent.getDataString());
        jsIntent.putArray("categories", Arguments.fromArray(categories.toArray(new String[0])));
        jsIntent.putMap("extras", Arguments.fromBundle(extras));
        promise.resolve(jsIntent);
    }
}
