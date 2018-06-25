## Debugging

`ionic cordova run android`

You can easily make a separate debug version of the app by adding the following lines to the `/platforms/android/app/build.gradle` file at `line 169`: 

```
buildTypes {
    debug {
        applicationIdSuffix '.debug'
        versionNameSuffix '-DEBUG'
    }
}
```

## Releasing

When releasing a new version you should update the version number in:
- package.json
- package-lock.json
- config.xml

#### Building

`ionic cordova build android --prod --release -- -- --keystore=platforms/huedrums-key.jks --storePassword="qwerty" --alias=huedrums --password="qwerty"`

The output can be found in `/platforms/android/app/build/outputs/apk/release/`.
