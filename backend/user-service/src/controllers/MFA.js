const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const enableMFA = async (req, res) => {
  const user = await User.findById(req.user.id);
  const secret = speakeasy.generateSecret();

  user.mfa = {
    secret: secret.base32,
    enabled: true,
  };

  await user.save();

  qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
    res.json({ message: 'MFA enabled', qrCode: dataUrl });
  });
};

const verifyMFA = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.mfa.secret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    return res.status(400).json({ message: 'Invalid MFA token' });
  }

  res.json({ message: 'MFA verified' });
};
