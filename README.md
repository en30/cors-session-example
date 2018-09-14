# CORS session example
```console
$ npm install
$ npm run init
$ $EDITOR .env # fill CLIENT_ID and CLIENT_SECRET
$ npm run client:start
$ ngrok http 3000 # or something similar
$ $EDITOR .env # fill FRONT_URI
$ npm run api:start
```
