<!-- #TODO
 
- have blaise fix download dialog and view only
- IOS bug- need to choose conference twice to switch
- refactor remaining pages and components
- if only one meeting, do not show meeting menu
- auth
- Post2020 integration
- app config to store meetings and merge with minor events on conf object -->

![SCBD Leaf][logo]
![SCBD][logoText]

[![codebeat badge](https://codebeat.co/badges/c285df61-93ad-47e2-bdc7-887ba7eda336)](https://codebeat.co/projects/github-com-scbd-cbd-events-master)
[![Dependency Status](https://david-dm.org/scbd/cbd-events.svg)](https://david-dm.org/scbd/cbd-events)
[![Dependency Status](https://david-dm.org/scbd/cbd-events/dev-status.svg)](https://david-dm.org/scbd/cbd-events?type=dev)

[![App Store][appStoreImg]](appStoreLink)
[![Play Store][playStoreImg]](appStoreLink) 


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
$ yarn build:ios
```
1. Open xcode studio project './cordova/platforms/ios'
2. Run in selected simulator


### Build android platform for production
``` bash
$ yarn build:android
```
1. Open android studio project './cordova/platforms/android'
2. Run in selected simulator

## Publish

[See the cordova workspace: https://github.com/scbd/cbd-events/blob/oweg-update/cordova/README.md](https://github.com/scbd/cbd-events/blob/oweg-update/cordova/README.md)


[logo]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif
[logoText]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-text-en.gif
[appStoreImg]:https://www.cbd.int/images/logos/com/Apple/Download_on_the_App_Store_Badge.png
[appStoreLink]:https://apps.apple.com/ca/app/cbd-events/id1441613306
[playStoreImg]:https://attachments.cbd.int/125x125/en_badge_web_generic.png
[playStoreLink]:https://play.google.com/store/apps/details?id=io.cbd.unbioevents&hl=en