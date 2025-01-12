const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://provider.com/oauth2/authorize',
      tokenURL: 'https://provider.com/oauth2/token',
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:5001/api/auth/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Логика обработки пользователя
      User.findOrCreate({ oauthId: profile.id }, (err, user) => {
        return done(err, user);
      });
    }
  )
);
