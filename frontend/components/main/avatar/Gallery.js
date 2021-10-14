import React, {useEffect, useLayoutEffect,useState} from 'react'
import { connect } from 'react-redux'
import {View, Text, Button, Image} from 'react-native'
import { IconButton, Colors } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export const Gallery = (props) => {
    const [image, setImage] = useState(props.currentUser.avatarURL);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [submit,setSubmit] = useState(false);
    const [state, setState] = useState({});
    useLayoutEffect(() => {
        props.navigation.setOptions({
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
            if(image !== props.currentUser.avatarURL){
                uploadImage();  
            }
            props.navigation.goBack();
        }
        
        
        (async () => {
        //   if (Platform.OS !== 'web') {
            const gallaryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(gallaryStatus.status = 'granted');
            // if (status !== 'granted') {
            //   alert('Sorry, we need camera roll permissions to make this work!');
            // }
        //   }
        })();

      }, [image, submit]);

    // Pick image from gallary
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

    //Save image into firebase storage
    const uploadImage = async() => {
        const uri = image;
        const childPath = `avatar/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase.storage()
                        .ref()
                        .child(childPath)
                        .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`);
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                saveAvatar(snapshot);
                console.log(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress,taskError,taskCompleted);
    }

    const saveAvatar = (downloadURL) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                avatarURL : downloadURL,
            })
    }
    if(hasGalleryPermission === null){
        return <View />
    }
    if(hasGalleryPermission === false){
        return <Text>Please permit for gallery access</Text>
    }
    return (
        <View style = {{flex: 1}}>
            {image && <Image source={{ uri: image }} style={{flex: 1}} />}
            <Button title="Pick an image" onPress={() => pickImage()} />
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})


export default connect(mapStateToProps, null)(Gallery)
