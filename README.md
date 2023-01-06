
# react-native-catalk-nft-wallet

## Getting started

`$ npm install react-native-catalk-nft-wallet --save`

### Mostly automatic installation

`$ react-native link react-native-catalk-nft-wallet`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.catalk.cc.RNCatalkNftWalletPackage;` to the imports at the top of the file
  - Add `new RNCatalkNftWalletPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-catalk-nft-wallet'
  	project(':react-native-catalk-nft-wallet').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-catalk-nft-wallet/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-catalk-nft-wallet')
  	```


## Usage
```javascript
import RNCatalkNftWallet from 'react-native-catalk-nft-wallet';

// TODO: What to do with the module?
RNCatalkNftWallet;
```
  