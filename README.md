<p align="center">
    <img width="100px" src="https://github.com/aleganza/akuse/blob/main/assets/img/icon/icon.png"/>
    <h1 align="center">Akuse</h1>
</p>

<p align="center">Simple and easy to use anime streaming desktop app without ads.</p>

<p align="center">
    <img alt="license" src="https://img.shields.io/github/license/aleganza/akuse"> 
    <img alt="GitHub release (with filter)" src="https://img.shields.io/github/v/release/akuse-app/akuse">
    <img alt="total-downloads" src="https://img.shields.io/github/downloads/aleganza/akuse/total">
    <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/aleganza/akuse?color=red">
    <a href="https://discord.gg/f3wdnqSNX5">
        <img alt="Discord" src="https://img.shields.io/discord/1163970236224118796?label=discord&color=%235567E3">
    </a>
</p>

<img title="img" alt="img" src="https://i.imgur.com/8IVaUfo.jpg">

## ⚙️ Running locally for development

Start cloning Akuse:

```
git clone https://github.com/akuse-app/Akuse.git
```

Next, go to [this link](https://anilist.co/settings/developer) and create a new AniList API Client.
As Redirect Uri, you can insert akuse://index and it should work.
Now go inside the src/modules folder and create a clientData.js file with a structure like this:

```
module.exports = {
    clientId: ,
    redirectUri: "",
    clientSecret: ""
}
```

Fill it with the data retrieved from the creation of your AniList API Client.

```bash
# Example:
module.exports = {
    clientId: 12345,
    redirectUri: "akuse://index",
    clientSecret: "iA04TKLO3k3LaVWhxucJwck0glR6uhiv"
}
```

Next, install its dependencies (make sure npm is installed on your machine):

```
npm install
```

To start, run:

```
npm start
```

## Building for Linux

Before building for linux make sure to install dependency `libcrypt` on your system

#### Debian base systems

```shell
sudo apt install libcrypt
```

#### Fedora/RHL systems

```shell
sudo dnf install libxcrypt-compat
```

### AppImage

- use script `dist:linux` using following command

  ```shell
  npm run dist:linux AppImage
  ```

  **Note:-** AppImage Does Not Support Login reason being deeplink's not supported by AppImage

## Deb

- deb also can be build using script `dist:linux` using following command

  ```shell
  npm run dist:linux deb
  ```

  **Note:-** DEB installation should support user login after installation (not yet tested).  Raise issue if login does not work for deb installations.

## Rpm

- rpm installation can be created using dist:linux using following command

  ```shell
  npm run dist:linux rpm
  ```

  **Note:-** RPM installation support user login. Tested on
- OS: **Fedora Workstation 39**
- DE: GNOME 45.4

## Flatpak

- install `flatpak` && `flatpak-builder` for your operating system usign appropriate package manager.
- set appropriate `runtimeVersion` and `baseVersion` in `package.json`

  ```json
  {
  .......package.json stuff......
      "build":{
          .......other electron-builder stuff......
          "flatpak":{
              "runtimeVersion":"23.08",
             "baseVersion":"23.08"
          }
      }
  }
  ```

  **Note:-** if `runtimeVersion` and `baseVersion` are not set it will default to`20.08` which might not be installed on your system so check the version using following command and update the package.json accordingly.

  ```shell
  flatpak info runtime/org.freedesktop.Platform

  ```

  The output will look something like this

  ```
  Freedesktop Platform - Runtime platform for applications

            ID: org.freedesktop.Platform
           Ref: runtime/org.freedesktop.Platform/x86_64/23.08
          Arch: x86_64
        Branch: 23.08
       Version: 23.08.11
       License: MIT
        Origin: flathub
    Collection: org.flathub.Stable
  Installation: system
     Installed: 592.2 MB

        Commit: 329ad0f04e21dc3234accff013641299e13a9eb2f1b2908129692b4755393789
        Parent: 3c58ded6fa422d45d30b070f26e428617f6e6509d18cfa1c31f959494511da66
       Subject: Export org.freedesktop.Platform
          Date: 2024-02-05 13:19:29 +0000
  ```

  specify the version `23.08` (according to above output) as `runtimeVersion` .

  check baseVersion using the following command

  ```shell
  flatpak info app/org.electronjs.Electron2.BaseApp
  ```

  if you get error something like this

  ```
  error: No remote refs found for ‘app/org.electronjs.Electron2.BaseApp/x86_64/23.08’

  ```

  this means you did not have BaseApp install it using following command
- ````shell
  flatpak install flathub app/org.electronjs.Electron2.BaseApp
  ````

  then run the previous command again to check the version and set the `baseVersion`
- At last use the following command to build the flatpak

  ```shell
  npm run dist:linux flatpak
  ```

  **Note:-** if you get any error while building flatpak run this `env DEBUG='@malept/flatpak-bundler'` command and then run above command again to see detailed logs.

## ⚠ How to Log-In in development

In development, the Log-In redirect doesn't work since the app is not packed and the Redirect Uri doesn't find it on your machine. If you need to work with an authenticated instance, just distribute the app (```npm run dist:win``` for Windows, other scripts are in package.json file) and Log-In from there once. After that, your app will be authenticated also in development mode.

## ⌨ Shortcuts

- Pages
  - F1: go to Discover page
  - F2: go to Library page
  - F3: go to Search page
- Video player
  - Space: play/pause video
  - Left arrow: fast rewind (5s)
  - Right arrow: fast forward (5s)
  - Upper arrow: increase volume
  - Lower arrow: decrease volume
  - F11: fullscreen toggler
  - F: fullscreen toggler
  - M: mute/unmute video
  - N: play next episode

## 🐛 Known Issues

- If Log-In doesn't work, make sure you have set a default browser.
- Some anime may don't work because of different names as compared to AniList: feel free to open a new issue if you find some of them so they can be fixed.

## 🌟 Contributors

[![](https://contrib.rocks/image?repo=akuse-app/akuse)](https://github.com/akuse-app/akuse/graphs/contributors)

## 🙌 Credits

- [Consumet API](https://github.com/consumet/consumet.ts): used to fetch episodes links
- [This API](https://api.ani.zip/mappings?anilist_id=21): used to fetch episodes info and thumbnails

## 📢 Disclaimer

- Akuse helps users find anime by simply scraping links from various websites.
- Akuse or its developers do not host the content found on Akuse. All images and anime information found in the app are retrieved from AniList public API.
- Additionally, all anime links found on Akuse are from various third party anime hosting websites.
- Akuse or its owner are not responsible for the misuse of any content inside or outside the app and shall not be responsible for the dissemination of any content within the app.
- By using this app, you agree that the app developer is not responsible for the content within the app. Nevertheless, they may or may not come from legitimate sources.
- For internet violations, please contact the source website. The developer is not legally responsible.

## 📜 License

Licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html#license-text).
