<p align="center">
    <img width="100px" src="https://github.com/aleganza/akuse/blob/main/assets/img/icon/icon.png"/>
    <h1 align="center">Akuse</h1>
</p>

<p align="center">
    <img alt="license" src="https://img.shields.io/github/license/aleganza/akuse"> 
    <img alt="stars" src="https://img.shields.io/github/stars/aleganza/akuse"> 
    <img alt="last-commit" src="https://img.shields.io/github/last-commit/aleganza/akuse/main"> 
</p>

<p align="center">
    <a href="https://www.buymeacoffee.com/aleganza">
        <img style="width:250px" alt="buymeacoffee" src="https://i.imgur.com/fxJ4BNq.png">
    </a>
</p>

<img title="img" alt="img" src="https://i.imgur.com/2qxWL2Z.png">

## C

## Running locally for development

Start cloning Akuse:

```
git clone https://github.com/aleganza/akuse.git
```

Next, go to [this link](https://anilist.co/settings/developer) and create a new AniList API Client.
As Redirect URL, you can insert http://localhost:9009/logged and it should work.
Now go inside the src/modules folder and create a clientData.js file with a structure like this:

```
module.exports = {
    clientId: ,
    redirectUri: "",
    clientSecret: ""
}
```

```bash
# Example:
module.exports = {
    clientId: 12345,
    redirectUri: "https://www.example.com/",
    clientSecret: "iA04TKLO3k3LaVWhxucJwck0glR6uhiv"
}
```

Fill it with the data retrieved from the creation of your AniList API Client.

Next, install its dependencies (make sure npm is installed on your machine):

```
npm install
```

To start, run:

```
npm start
```

## Known Issues

* Some anime don't work because of different names as compared to AniList: Feel free to open a new issue if you find some of them so I can fix them all!
* All anime are subbed, but some may be dubbed.
* Some UI elements may not be responsive.
* "Delete" button in List Editor don't work (can't figure out why).
* Logout button only disconnects you from your AniList account, does not close the app instance.

## Disclaimer

- Akuse helps users find anime by simply scraping links from various websites.
- Akuse or its developers do not host the content found on Akuse. All images and anime information found in the app are retrieved from AniList public API.
- Additionally, all anime links found on Akuse are from various third party anime hosting websites.
- Akuse or its owner are not responsible for the misuse of any content inside or outside the app and shall not be responsible for the dissemination of any content within the app.
- By using this app, you agree that the app developer is not responsible for the content within the app. Nevertheless, they may or may not come from legitimate sources.
- For internet violations, please contact the source website. The developer is not legally responsible.

## License

Licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html#license-text).
