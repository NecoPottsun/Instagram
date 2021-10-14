import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native';

import firebase from './Firebase';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import { IconButton, Colors } from 'react-native-paper';
const store = createStore(rootReducer, applyMiddleware(thunk));


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentsScreen from './components/main/Comments';
import EditScreen from './components/main/Edit';
import EditAvatarScreen from './components/main/EditAvatar';

const Stack = createNativeStackNavigator();


export class App extends Component {
  /* Create constructor*/
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loaded: true,
          loggedIn: false,
        })
      }
      else {
        this.setState({
          loaded: true,
          loggedIn: true,
        })
      }
    })
  }
  componentWillUnmount() {

  }

  render() {
    const { loaded, loggedIn } = this.state;
    if (!loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Loading</Text>
        </View> 
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    } else {
      return (
        <Provider store = {store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name = "Main" component={MainScreen} options= {{headerShown: false}}/>
              <Stack.Screen name = "Add" component={AddScreen} navigation = {this.props.navigation}/>
              <Stack.Screen name = "Save" component={SaveScreen}/>
              <Stack.Screen name = "Comments" component={CommentsScreen}/>
              <Stack.Screen name = "Edit" component = {EditScreen} navigation = {this.props.navigation}/>
              <Stack.Screen name = "EditAvatar" component = {EditAvatarScreen} options= {{headerShown: false}}/>
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>

      )
    }

  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    fontSize : 24,
    fontWeight : 'bold',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
  
});



