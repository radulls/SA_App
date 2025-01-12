import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const ReCaptcha: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const webviewRef = useRef<WebView>(null);

  const handleOpenCaptcha = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        grecaptcha.ready(function() {
          grecaptcha.execute('6LeiCLUqAAAAABQky3aGL5KI4gyQz2OXuMGj78uS', { action: 'submit' }).then(function(token) {
            window.ReactNativeWebView.postMessage(token);
          });
        });
      `);
    }
  };

  const handleMessage = (event: any) => {
    const token = event.nativeEvent.data;
    if (token) {
      console.log('reCAPTCHA token:', token);
      Alert.alert('Успех', 'Капча пройдена!');
      setIsVerified(true);
    } else {
      Alert.alert('Ошибка', 'Не удалось пройти капчу.');
    }
  };

  return (
    <View style={styles.container}>
      {!isVerified && (
        <>
          <Button title="Пройти проверку reCAPTCHA" onPress={handleOpenCaptcha} />
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{
              html: `
                <html>
                  <head>
                    <script src="https://www.google.com/recaptcha/api.js?render=6LeiCLUqAAAAABQky3aGL5KI4gyQz2OXuMGj78uS"></script>
                  </head>
                  <body>
                    <script>
                      window.ReactNativeWebView.postMessage(''); // Уведомление, что WebView готово
                    </script>
                  </body>
                </html>
              `,
            }}
            onMessage={handleMessage}
            style={{ height: 1, width: 1 }} // Невидимый WebView
          />
        </>
      )}
      {isVerified && <Text>Вы успешно прошли проверку reCAPTCHA!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReCaptcha;
