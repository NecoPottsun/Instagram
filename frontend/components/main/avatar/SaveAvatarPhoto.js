import React, { useEffect, useLayoutEffect, useState } from 'react'
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native'
import { IconButton, Colors } from 'react-native-paper';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function SaveAvatarPhoto(props) {
    const [submit,setSubmit] = useState(false);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <IconButton
                  icon = "keyboard-backspace"
                  color="#3c3c3c"
                  size={30}
                  style = {{padding: 15}}
                  onPress={() => props.navigation.goBack()}
                />
            ),
            headerRight: () => (
                <IconButton
                  icon = "check"
                  color="#3c3c3c"
                  size={30}
                  style = {{padding: 15}}
                  onPress={() => setSubmit(true)}
                />
            )
        })
    }, [props.navigation])
    useEffect(() => {
        if(submit){
            uploadImage();
        }
        setSubmit(false);
    }, [submit,props.route.params])
    const uploadImage = async () => {
        const uri = props.route.params.imageURL;
        const childPath = `avatar/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase.storage()
                        .ref()
                        .child(childPath)
                        .put(blob);
        
        const taskProgress = snapshot =>{
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                saveAvatar(snapshot);
                
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }
    const saveAvatar = (downloadURL) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                avatarURL: downloadURL,
            })
            .then(
                props.navigation.navigate('Edit')
            )
    }
    return (
        <View style = {styles.container}>
            <View style = {styles.imageContainer}>
                <Image 
                    source = {{uri : props.route.params.imageURL}}
                    style = {styles.image}
                />
            </View>
            <View style = {styles.editImageContainer}>

            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        backgroundColor:'#ffffff',
        
    },
    image: {
        flex: 1,
        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height)/2,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor:'#ebebeb',
    },
    editImageContainer: {
        flex: 1,

    },
});
