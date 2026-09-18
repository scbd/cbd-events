![SCBD Leaf][logo]
![SCBD][logoText]



[![App Store][appStoreImg]](https://apps.apple.com/ca/app/cbd-events/id1441613306)
[![Play Store][playStoreImg]](https://play.google.com/store/apps/details?id=io.cbd.unbioevents)


# CBD-Events

Hybrid mobile app (Nuxt 2 SPA + Capacitor) delivering UN Biodiversity conference information —
agendas, documents, calendars and articles — with offline-first storage.

Contributor and AI-agent conventions live in [AGENTS.md](AGENTS.md).

## Prerequisites

Node `>=22` (see `.nvmrc`), plus Yarn.

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

| Command | What it does |
|---|---|
| `yarn install` | Install dependencies |
| `yarn dev` | Serve with hot reload at localhost:3000 (`NODE_ENV=local`) |
| `yarn build:i` | `NODE_ENV=ios nuxt generate` into `capacitor/www`, then `cap sync ios` |
| `yarn build:a` | `NODE_ENV=android nuxt generate`, `jetify`, then `cap sync android` |
| `yarn test:smoke` | Build smoke test (`scripts/smoke-build.mjs`) |
| `yarn clean-reinstall` | Drop lockfiles + `node_modules` and reinstall from scratch |

After `yarn build:i`, open `capacitor/ios/App/App.xcworkspace` in Xcode and run a simulator.
After `yarn build:a`, open `capacitor/android` in Android Studio and run an emulator.

Build output directory is set by `generate: { dir: 'capacitor/www' }` in `nuxt.config.js`.

## Environment variables

Defined in the `env` block of `nuxt.config.js` (no `.env` file; values are baked in at build time).

| Variable | Value | Used for |
|---|---|---|
| `NUXT_ENV_API` | `https://api.cbd.int` | All API calls (conferences, meetings, articles, solr, oembed) |
| `NUXT_ENV_ATTACHMENTS` | `https://attachments.cbd.int` | Static image assets (header leaf logo) |
| `NUXT_ENV_IFRAME_HOST` | `https://www.cbd.int` | Origin of the embedded documents/agenda iframes and `postMessage` target |
| `NUXT_ENV_BASE_URL` | `https://cbd-events.cbd.int` | Canonical site URL |
| `NUXT_ENV_VERSION` | from `package.json` | OTA version comparison (`composables/over-the-air.js`) |

## API endpoints used

| Endpoint | Where |
|---|---|
| `/api/v2016/conferences` | `store/conferences.js` |
| `/api/v2016/meetings` | `store/conferences.js` |
| `/api/v2016/meetings/{meeting}/documents/{id}` | `components/Calendar/src/components/event/CalEventDetailsFile*.vue` |
| `/api/v2017/articles` | `store/about.js`, `store/article.js` — see [Articles endpoint](#articles-endpoint) |
| `/api/v2013/index/select` (Solr) | `pages/_conferenceCode/_meetingCode/calendar.vue` |
| `/api/v2013/thesaurus/domains/CBD-SUBJECTS/terms` | `components/Calendar/src/components/body/CalFilter.vue` |
| `/api/v2020/oembed` | `components/article.vue` |

## Conference app contract: `apps.cbdEvents`

Conferences are authored in the CBD conference registry; this app reads a single per-conference
configuration object at `conference.apps.cbdEvents`. **Presence of that object is what opts a
conference into the app** — `store/conferences.js` queries
`/api/v2016/conferences` with `q={"apps.cbdEvents":{"$exists":true}}`, so a conference without it
is invisible to CBD-Events entirely.

Responses pass through `normalizeApiResponse`, so authored keys arrive camelCased. Localized
string fields (`lstring`) are `{ en: '...', fr: '...' }` objects rendered through the `lstring`
filter.

| Key | Type | Default when absent | What it controls | Read in |
|---|---|---|---|---|
| *(the object itself)* | object | conference is excluded | Opts the conference into CBD-Events | `store/conferences.js:171` |
| `title` | lstring | header/picker fall back to `{}` | Conference title in the header bar and the conference picker | `components/header/header.vue:83`, `pages/_conferenceCode/conferences.vue:42`, `modules/CoverImageMixin.js:26` |
| `description` | lstring | none | Conference description helper on the picker page | `pages/_conferenceCode/conferences.vue:48` |
| `image` | URL | CBD logo placeholder | Tile/logo image; also the hero fallback | `pages/_conferenceCode/conferences.vue:80`, `modules/CoverImageMixin.js:7` |
| `heroImage` | URL | falls back to `image` | Full-width hero image on the conference home screen | `store/conferences.js:189`, `pages/_conferenceCode/index.vue`, `modules/CoverImageMixin.js:15` |
| `hasAbout` | boolean | About button hidden unless an About article resolves anyway | Shows the **About** button on the home screen | `pages/_conferenceCode/index.vue:107`, `middleware/redirects.js:18` |
| `buttons` | array | no extra buttons | Extra home-screen buttons, each linking to an article by tag | `pages/_conferenceCode/index.vue:76` |
| `buttons[].tag` | string | — | `adminTag` of the article to render at `/:conferenceCode/article/:tag` | `pages/_conferenceCode/index.vue` template |
| `buttons[].text` | string | — | Button label (rendered verbatim, not an lstring) | same |
| `buttons[].icon` | string | — | Icon name from `plugins/icons` | same |
| `buttons[].size` | number | half width | `2` renders full width (`col-12`); anything else is `col-6` | same |
| `buttons[].status` | truthy | button hidden | Only buttons with a truthy `status` are rendered | `pages/_conferenceCode/index.vue:76` |
| `supportEmail` | string | `it@cbd.int` | IT Support mailto link in the side menu | `components/header/SideMenu.vue:73` |
| `hideCalendar` | boolean | calendar shown | `true` hides the **Calendar** button (getter `conferences/showCalendar`) | `store/conferences.js:79` |
| `useMenus` | boolean | `false` — meetings come from `majorEventIds` | `true` sources meetings from `conference.menus` / `events[].menus` matched by `code`; `false` sources them from `majorEventIds` matched by `_id` | `store/conferences.js:221-246`, `312-320` |
| `start` | ISO date | `conference.startDate` | Overrides the calendar's initial date and the Solr `start_s` floor | `components/Calendar/src/components/index.vue:62`, `pages/_conferenceCode/_meetingCode/calendar.vue:77` |
| `end` | ISO date | `conference.endDate` | Overrides the Solr `end_s` ceiling | `pages/_conferenceCode/_meetingCode/calendar.vue:77` |

### Runtime-only keys

`loadBlobs()` in `store/conferences.js` mutates the selected conference and adds two keys that are
**not authored** in the registry — do not set them upstream:

| Key | Source |
|---|---|
| `imageBlob` | Blob fetched from `image`, cached for offline rendering |
| `heroImageBlob` | Blob fetched from `heroImage`, cached for offline rendering |

### Conference-level fields the app also reads

These sit on the conference document itself, not under `apps.cbdEvents`:
`code`, `id`, `active`, `startDate`, `endDate`, `timezone`, `majorEventIds`, `menus` /
`events[].menus`, `conference`, and (inconsistently) `hasAbout`.

Two sibling app keys matter:

- `apps.conferenceCal` — presence renders the **Overview** button and the `@scbd/conference-cal`
  overview calendar (`store/conferences.js:85`, `pages/_conferenceCode/overview.vue`).

### Known inconsistencies

- `hasAbout` is read from `apps.cbdEvents` in `pages/_conferenceCode/index.vue:107` but from the
  conference root in `middleware/redirects.js:18`. Setting it in only one place gives a half-working
  About section (button without preload, or preload without button).
- `modules/CoverImageMixin.js:21` reads `selected.app.cbdEvents` (singular `app`), which never
  resolves; the `try/catch` swallows it and returns `{}`.

## Articles endpoint

All long-form content (About page, home article, custom button pages) comes from one endpoint:

```
GET {NUXT_ENV_API}/api/v2017/articles?ag=<url-encoded aggregation pipeline>
```

The pipeline is built identically in `store/about.js:82` and `store/article.js:94`:

```js
[
  { $match  : { adminTags: { $all: [ <tag>, <conferenceCode> ] } } },
  { $project: { title: 1, summary: 1, content: 1, coverImage: 1 } },
  { $sort   : { 'meta.updatedOn': -1 } },
  { $limit  : 1 }
]
```

Only `data[0]` is used, so the **most recently updated** matching article wins.

### Required admin tags

An article must carry **both** tags (`$all`) to be found. Tags are matched exactly — the second tag
is the conference `code`, case-sensitive.

| Article | Required `adminTags` | Rendered at | Loader |
|---|---|---|---|
| About page | `cbd-events` + `<conferenceCode>` | `/:conferenceCode/about` | `store/about.js` |
| Home screen article | `cbd-events-home` + `<conferenceCode>` | `/:conferenceCode` | `store/article.js` |
| Custom button page | `<buttons[].tag>` + `<conferenceCode>` | `/:conferenceCode/article/:tag` | `store/article.js` |

`store/article.js` defaults its tag to `cbd-events-home` when neither an explicit `tag` argument nor
a `:tag` route param is present.

### App values and flags each article needs

| To publish | Set in `apps.cbdEvents` | Also required |
|---|---|---|
| About page | `hasAbout: true` | Article tagged `cbd-events` + `<conferenceCode>` |
| Home article | nothing — always fetched | Article tagged `cbd-events-home` + `<conferenceCode>`; renders only if `content` or a cover-image blob resolves |
| Custom button page | `buttons[]` entry with `tag`, `text`, `icon`, truthy `status` (optional `size: 2`) | Article tagged `<tag>` + `<conferenceCode>` |

### Article document fields consumed

| Field | Use |
|---|---|
| `title` | lstring; the page renders nothing when it is empty |
| `content` | lstring of CKEditor HTML, injected with `v-html` inside `.ck-content` |
| `coverImage.url` | Fetched as a blob and shown as the hero image above the body |
| `summary` | Projected but not currently rendered |

`components/article.vue` post-processes the injected HTML: any `<oembed url="...">` element is
resolved through `/api/v2020/oembed` on mount and replaced with embedded media (YouTube handled
specially).

### Caching

Articles are cached in localForage and served stale-while-revalidate — the cached copy returns
immediately and a forced reload is dispatched in the background.

| Store | Key | Written by |
|---|---|---|
| `$localForage.about` | `conferenceCode` | `store/about.js` |
| `$localForage.article` | `` `${conferenceCode}-${tag}` `` | `store/article.js` |

## Publish

### Android
[Play Console](https://play.google.com/console/u/0/developers/5920734745096691256/app/4973343219570834460/app-dashboard?timespan=thirtyDays)

[App Store Connect](https://appstoreconnect.apple.com/apps/1441613306/appstore/ios/version/deliverable)

## Over the Air Update (experimental)
Build for any platform.  Bump the release (patch or minor only). Make a release by the version.  Zip a  the cap/www folder  ENSURE no .file inside or entire app will crash with no turning back.  Add that zip file as an asset in the release.  Copy the release to s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/${major}/${minor}/${patch}/dist.zip

`aws s3 cp ./dist.zip s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/${major}/${minor}/${patch}/dist.zip`

Lastly update s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/index.json pushing the object to the array { tag_name: `${semiVersion}` }, using the acutal semiverion not the var rep.  Essentially following format https://api.github.com/repos/scbd/www.cbd.int/releases.

Updates only apply within the same major version (semver constraint in `composables/over-the-air.js`).


### NOTES
Must use this commit otherwise the original package will inject a prohibited permission into the android build which will cause ejection of publication.
["cordova-plugin-file-opener2": "github:pwlin/cordova-plugin-file-opener2#0b15d93b4f0c5a70206fe276f7aa956f754c3ca3"](https://github.com/pwlin/cordova-plugin-file-opener2/commit/0b15d93b4f0c5a70206fe276f7aa956f754c3ca3)




[logo]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-leaf-line.gif
[logoText]:https://www.cbd.int/styles/ui/templates/cbd2011/images/logo-cbd-text-en.gif
[appStoreImg]:https://www.cbd.int/images/logos/com/Apple/Download_on_the_App_Store_Badge.png
[appStoreLink]:https://apps.apple.com/ca/app/cbd-events/id1441613306
[playStoreImg]:https://attachments.cbd.int/125x125/en_badge_web_generic.png
[playStoreLink]:https://play.google.com/store/apps/details?id=io.cbd.unbioevents&hl=en
