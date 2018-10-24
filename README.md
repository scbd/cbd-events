# CBD-Events PWA



## Build Setup

``` bash
# install dependencies
$ yarn install

# hack for children components that are stand alone
# until team decision is made design system, mono repo, bitsrc.io, yarn work spaces, versioning, lerna
$ cd components/AddToCalendar/src && yarn
$ cd components/Calender && yarn
$ cd components/conference-cal && yarn

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
