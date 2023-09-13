<p align="center">
    <img width="100px" src="https://github.com/aleganza/akuse/blob/main/assets/img/icon/icon-1024.png"/>
    <h1 align="center">Akuse</h1>
</p>

<p align="center">
    <img alt="license" src="https://img.shields.io/github/license/aleganza/akuse"> 
    <img alt="stars" src="https://img.shields.io/github/stars/aleganza/akuse"> 
    <img alt="last-commit" src="https://img.shields.io/github/last-commit/aleganza/akuse/main"> 
</p>

<img title="img" alt="img" src="https://i.imgur.com/TCXJQm2.png">

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

## Disclaimer

Akuse is a no-profit project developed only for educational purposes by the [Author](https://github.com/aleganza), I am not affiliated with Anilist and I do not host illegal files. By no means this encourage content piracy. Please support original content creators!

## License

Licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html#license-text).
