#TODO

- have blaise fix download dialog and view only
- test no cover and just standard image
- install codepush - test
- test ios
- deploy on ios

# CBD-Events PWA

android/project.properties 
change to: cordova.system.library.1=com.android.support:support-v4:27.1.0

gradle.build
defaultTargetSdkVersion=28 //Integer - We ALWAYS target the latest by default
defaultCompileSdkVersion=28 //Integer - We ALWAYS compile with the latest by default

## Build Setup

``` bash
# install dependencies
$ yarn install





# serve with hot reload at localhost:3000
$ yarn dev

# serve with hot reload at localhost:3000 config closer to ios/cordova needs
$ yarn dev:ios

# build for production and launch server
$ yarn build
$ yarn start

# build for dev and launch server
$ yarn build:dev
$ yarn start:dev

# build for stg and launch server
$ yarn build:stg
$ yarn start:stg

# generate static project
$ yarn run generate

# build production cordova for ios
yarn build:ios

# build dev cordova for ios
yarn build:ios:dev

# to open the project xcode and the simulator on OSX
$ yarn ios:sim
```
