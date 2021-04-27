import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import TopBar from './component/topBar/topBar.component';
import HomeView from './View/screenMusic/screenPageHome.screen'
import { CreateTableFolderLocation, DropTable } from './controller/transaction/addDirectory';

export default class App extends React.Component {
  componentDidMount() {
    // DropTable()
    CreateTableFolderLocation();
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <TopBar />
        <HomeView />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0278AE',
    alignItems: 'center',
  },
});
