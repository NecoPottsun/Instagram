import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { useDeviceOrientation } from '@react-native-community/hooks';
import firebase from 'firebase'


export default function Setting() {
  const {landscape} = useDeviceOrientation();
  const onLogout = () => {
    firebase.auth().signOut();
  }
  return (
      <View style={styles.container}>
        {/* <View style = {styles.banner}>
          <Text style = {[styles.headerText, {paddingLeft: landscape ? '2%' : '5%', paddingVertical: landscape ? '' : '5%',}]}>Setting</Text>
        </View> */}
        <TouchableOpacity style= {styles.logoutButton}onPress = {() => onLogout()}>
          <Text style = {styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'baseline',
      flexDirection: 'row',
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
    logoutButton: {
      flex: 1, 
      margin: 20,
    },
    logoutText: {
      fonSize: 16,
      fontWeight: "bold",
      color: "blue",
    },
  });
  
  
  