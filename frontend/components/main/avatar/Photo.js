import React, { useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { Camera } from 'expo-camera';

function Photo(props) {
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [pictureTaken, setPictureTaken] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [cancel, setCancel] = useState(false);
    useLayoutEffect(() => {
        console.log(pictureTaken)
        if(pictureTaken){
            props.navigation.setOptions({
                headerLeft: () => (
                    <IconButton
                      icon = "close"
                      color="#3c3c3c"
                      size={30}
                      style = {{padding: 15}}
                      onPress={() => setCancel(true)}
                    />
                ),
                headerRight: () => (
                    <IconButton
                      icon = "arrow-right"
                      color="#3c3c3c"
                      size={30}
                      style = {{padding: 15}}
                      onPress={() => setSubmit(true)}
                    />
                )
            })
        }
        else{
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
                headerRight: false
            })
        }
    }, [props.navigation, pictureTaken,submit])
    useEffect(() => {
        (async () => {
            if(submit && pictureTaken){
                props.navigation.navigate("SaveAvatarPhoto" , {imageURL: image});
                console.log(image)
                
            }
            if(cancel){
                setSubmit(false);
                setPictureTaken(false);
                setImage("");
                console.log("Cancel clicked")
            }
            setCancel(false)
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
      })();
    }, [submit,pictureTaken,image,cancel]);
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
            console.log(data.uri);
            setPictureTaken(true);
        }
    }
    return (
        <View style={styles.container}>
        <View style = {styles.cameraContainer}>
            {pictureTaken === false ? (
                <Camera 
                    style={styles.fixedRatio} 
                    type={type}
                    ref = {ref => setCamera(ref)}
                    ratio= {'1:1'}
                >
                    <View style={styles.buttonInsideCameraContainer}>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                            );
                        }}>
                        <Text style={styles.text}> Flip </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            ) : (
                <Image 
                source = {{uri : image}}
                style = {styles.image}
                />
            )
            }
        </View>

        <View style = {styles.buttonContainer}>
            <TouchableOpacity
                style = {styles.circleButton}
                onPress = {() => takePicture()}
            >

            </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    cameraContainer: {
        flex: 1,
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    },
    image: {
        flex: 1,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor:'#ebebeb',
    },
    buttonInsideCameraContainer: {

    },
    buttonContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems:'center'
    },
    button: {

    },
    circleButton: {
        borderWidth:20,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:100,
        height:100,
        backgroundColor:'#fff',
        borderRadius:50,
    },

});
export default Photo
