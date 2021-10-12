import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { useDeviceOrientation } from '@react-native-community/hooks';
import firebase from 'firebase'


export default function Setting({navigation}) {
  const {landscape} = useDeviceOrientation();
  const onLogout = () => {
    firebase.auth().signOut();
  }
  return (
      <View style={styles.container}>
        <TouchableOpacity style= {styles.button} onPress = {() => navigation.navigate('Edit')}>
          <Text style = {styles.functionText}>Edit your info</Text>
        </TouchableOpacity>
        <TouchableOpacity style= {styles.button} onPress = {() => onLogout()}>
          <Text style = {styles.functionText}>Log out</Text>
        </TouchableOpacity>
      </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'baseline',
      flexDirection: 'column',
    },
    banner:{
      backgroundColor: '#ffffff',
      flex:1,
      alignItems: 'baseline',
      height: '10%',
    },
    headerText: {
      fontSize : 24,
      fontWeight : 'bold',
      color: '#423f3f',
      textAlign:'center',
    },
    button: {
      margin: 10,
    },
    functionText: {
      fonSize: 16,
      fontWeight: "bold",
      color: "blue",
    },
  });
  
  
  