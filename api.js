const axios = require('axios');
const qs = require('qs');
const {google} = require('googleapis');
const express = require('express');
const session = require('express-session');
const app = express();

require('dotenv').config();

const redirectUri = 'http://localhost:4000/callback';

const createClient = () => new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirectUri
);

const authUrl = createClient().generateAuthUrl({ scope: 'https://www.googleapis.com/auth/userinfo.profile' });

const fetchUser = async (auth) => {
  const res = await google.oauth2({ auth, version: 'v2'}).userinfo.v2.me.get();
  return res.data.name;
};

const cors = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', process.env.FRONT_URI);
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
}

app.use(session({ secret: process.env.SESSION_SECRET }));

app.get('/auth', (req, res) => {
  res.redirect(authUrl);
})

app.get('/callback', async (req, res) => {
  try {
    const client = createClient()
    const { tokens } = await client.getToken(req.query.code);
    client.credentials = tokens;
    req.session.user = await fetchUser(client);
    res.redirect(process.env.FRONT_URI);
  } catch(err) {
    console.error(err);
    res.status(500).end();
  }     
})

app.options('/session', cors, async(req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, DELETE');
  res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');  
  res.status(200).end();
})

app.get('/session', cors, async(req, res) => {
  res.status(200).json({ user: req.session.user });
})

app.delete('/session', cors, async(req, res) => {
  req.session.destroy((err) => {
    res.status(200).end();
  })
})

app.listen(4000);
