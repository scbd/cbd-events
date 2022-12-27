![SCBD Leaf][logo]
![SCBD][logoText]



[![App Store][appStoreImg]](https://apps.apple.com/ca/app/cbd-events/id1441613306)
[![Play Store][playStoreImg]](https://play.google.com/store/apps/details?id=io.cbd.unbioevents) 


# CBD-Events 

## Prerequisites

### Android
Install the following:

1. https://www.java.com/ES/download/
2. https://gradle.org/install/
3. https://developer.android.com/studio
4. Down load simulator in android studio tools > avd manager

```bash
echo "ANDROID_SDK_ROOT=/Users/$(whoami)/Library/Android/sdk" >>~/.bash_profile
```

### IOS
Install the following:

1. https://apps.apple.com/ca/app/xcode/id497799835?mt=12


## Build Setup

### Install dependencies
``` bash
$ yarn install
```

### Serve with hot reload at localhost:3000
``` bash
$ yarn dev
```

### Build ios platform for production
``` bash
$ yarn build:i
```
1. Open xcode studio project './cordova/platforms/ios'
2. Run in selected simulator


### Build android platform for production
``` bash
$ yarn build:a
```
1. Open android studio project './cordova/platforms/android'
2. Run in selected simulator

## Publish

### Android 
[Play Console](https://play.google.com/console/u/0/developers/5920734745096691256/app/4973343219570834460/app-dashboard?timespan=thirtyDays)

[App Store Connect](https://appstoreconnect.apple.com/apps/1441613306/appstore/ios/version/deliverable)

## Over the Air Update (experimental) 
Build for any platform.  Bump the release (patch or minor only). Make a release by the version.  Zip a  the cap/www folder  ENSURE no .file inside or entire app will crash with no turning back.  Add that zip file as an asset in the release.  Copy the release to s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/${major}/${minor}/${patch}/dist.zip 

`aws s3 cp ./dist.zip s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/${major}/${minor}/${patch}/dist.zip`

Lastly update s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/index.json pushing the object to the array { tag_name: `${semiVersion}` }, using the acutal semiverion not the var rep.  Essentially following format https://api.github.com/repos/scbd/www.cbd.int/releases.


### NOTES
Must use this commit otherwise the original package will inject a prohibited permission into the android build which will cause ejection of publication.
["cordova-plugin-file-opener2": "github:pwlin/cordova-plugin-file-opener2#0b15d93b4f0c5a70206fe276f7aa956f754c3ca3"](https://github.com/pwlin/cordova-plugin-file-opener2/commit/0b15d93b4f0c5a70206fe276f7aa956f754c3ca3)




[logo]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif
[logoText]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-text-en.gif
[appStoreImg]:https://www.cbd.int/images/logos/com/Apple/Download_on_the_App_Store_Badge.png
[appStoreLink]:https://apps.apple.com/ca/app/cbd-events/id1441613306
[playStoreImg]:https://attachments.cbd.int/125x125/en_badge_web_generic.png
[playStoreLink]:https://play.google.com/store/apps/details?id=io.cbd.unbioevents&hl=en