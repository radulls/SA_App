declare module 'react-native-google-recaptcha-v2' {
  import { Component } from 'react';

  interface RecaptchaProps {
    siteKey: string;
    baseUrl: string;
    onVerify: (token: string) => void;
    onExpire?: () => void;
    size?: 'invisible' | 'normal';
    theme?: 'light' | 'dark';
    badge?: 'bottomright' | 'bottomleft' | 'inline';
  }

  export default class Recaptcha extends Component<RecaptchaProps> {
    open(): void;
    close(): void;
  }
}
