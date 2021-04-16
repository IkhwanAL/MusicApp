import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import TopBar from './component/topBar/topBar.component';
import HomeView from './View/screenMusic/screenPageHome.screen'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <TopBar />
      <HomeView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0278AE',
    alignItems: 'center',
  },
});
