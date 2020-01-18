import React from 'react';
import { View } from 'react-native';

// import { Container } from './styles';
import { WebView } from 'react-native-webview';
export default function Profile({navigation}) {
  const user = navigation.getParam('github_username')
  
    return (
        <WebView   style={{ flex:1}} source={{ uri: `https://github.com/${user}`}}/>
    );
}


