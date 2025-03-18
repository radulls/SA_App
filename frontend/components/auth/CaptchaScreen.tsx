import React, { useRef } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview'; // Для мобильных
import ReCAPTCHA from 'react-google-recaptcha'; // Для веба

interface CaptchaScreenProps {
  onSuccess: () => void;
}

const CaptchaScreen: React.FC<CaptchaScreenProps> = ({ onSuccess }) => {
  const siteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  const baseUrl = 'https://f5e2-5-76-221-62.ngrok-free.app';

  const onVerify = (token: string) => {
    console.log('Капча пройдена! Токен:', token);
    onSuccess();
  };

  // Реализация для веба
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logo} />
              <View style={styles.form}>
                <Text style={styles.title}>Подтвердите, что вы не робот</Text>
                <Text style={styles.description}>
                  Капча нужна, чтобы определить, кто пытается совершить операцию — человек или робот.
                </Text>
                <View style={styles.captchaContainer}>
                  <ReCAPTCHA
                    sitekey={siteKey}
                    size="normal"
                    onChange={onVerify}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Реализация для мобильных
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo} />
            <View style={styles.form}>
              <Text style={styles.title}>Подтвердите, что вы не робот</Text>
              <Text style={styles.description}>
                Капча нужна, чтобы определить, кто пытается совершить операцию — человек или робот.
              </Text>
              <View style={styles.captchaContainer}>
                <WebView
                  source={{
                    html: `
                      <html>
                        <head>
                          <script src="https://www.google.com/recaptcha/api.js"></script>
                          <style>
                            body {
                              margin: 0;
                              padding: 0;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100%;
                              width: 100%;
                              background-color: #1E1E1E;
                              border-radius: 12px;
                            }
                          </style>
                        </head>
                        <body>
                          <div 
                            class="g-recaptcha" 
                            data-sitekey="${siteKey}" 
                            data-size="invisible" 
                            data-callback="onVerify"
                            style="borderRadius: 12px;">
                          </div>
                          <script>
                            function onVerify(response) {
                              // Отправляем токен обратно в React Native
                              window.ReactNativeWebView.postMessage(response);
                            }
                            // Запускаем капчу автоматически
                            grecaptcha.ready(function() {
                              grecaptcha.execute();
                            });
                          </script>
                        </body>
                      </html>
                    `,
                    baseUrl,
                  }}
                  style={{ flex: 1 }}
                  javaScriptEnabled
                  originWhitelist={['*']}
                  onMessage={(event) => {
                    const token = event.nativeEvent.data;
                    console.log('Капча пройдена! Токен:', token);
                    onSuccess();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    flexGrow: 1,
    width: '100%',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 100)',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 100)',
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 58,
    maxWidth: 600,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    backgroundColor: 'rgba(67, 67, 67, 1)',
    width: 186,
    height: 240,
  },
  form: {
    marginTop: 28,
    width: '100%',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  description: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
    marginBottom: 30,
  },
  captchaContainer: {
    height: 179,
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 41,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  regularText: {
    fontSize: 12,
    color: 'rgba(139, 139, 139, 1)',
    fontWeight: '500',
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(148,179,255,1)',
  },
});

export default CaptchaScreen;
