import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity,TextInput, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';

import { useDeviceOrientation } from '@react-native-community/hooks';

require('firebase/firestore')
export default function Search(props) {
  const {landscape} = useDeviceOrientation();
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    console.log(search);
    firebase.firestore()
    .collection('users')
    .where('name' , '==' , search)
    .get()
    .then((snapshot) => {
      let users = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        console.log({id, ...data})
        return {id , ...data}

      });
      console.log(users);
      setUsers(users);
    })
  }
  return (
      <View style={styles.container}>
        {/* <View style = {styles.banner}>
          <Text style = {[styles.headerText, {paddingLeft: landscape ? '2%' : '5%', paddingVertical: landscape ? '' : '5%',}]}>Search</Text>
        </View> */}
        <View style = {styles.containerSearch}>
          <TextInput 
            style = {styles.searchInputText}
            placeholder = "Search"
            onChangeText = {(search) => {
              fetchUsers(search);
            }}
          />
        </View>
        <View style = {styles.containerResult}>
            <FlatList 
              numColumns = {1}
              horizontal = {false}
              data = {users}
              renderItem = {({item}) => (
                <TouchableOpacity onPress = {() => props.navigation.navigate('Profile', {uid: item.id, username: item.username})}>
                  <Text>{item.name}</Text> 
                </TouchableOpacity>
              )}
            />
        </View>

      </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'column',
    },
    containerSearch:{
      backgroundColor: '#ffffff',
      flex:1,
      alignItems: 'center',
      flexDirection: 'row',

    },
    searchInputText:{
      backgroundColor: '#fafafa',
      borderColor: '#e0e0e0',
      flex: 1,
      borderWidth: 2,
      borderRadius: 20,
      paddingLeft: 10,
      alignItems:'center',
      marginRight: 40,
      marginLeft: 40, 
      paddingRight: 10,
      paddingLeft:10,

    },
    containerResult: {
      flex: 10,
      paddingVertical: 20,
      paddingHorizontal: 40,

    },

    headerText: {
      fontSize : 24,
      fontWeight : 'bold',
      color: '#423f3f',
      textAlign:'center',
    },
  });
  
  
  