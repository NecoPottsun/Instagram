import React,{useState, useEffect, useLayoutEffect}  from 'react'
import {View, Button, TextInput, Text, Image , StyleSheet, TouchableOpacity} from 'react-native'
import { IconButton, Colors } from 'react-native-paper';
import firebase from 'firebase'

import { connect } from 'react-redux';

function Edit(props, {navigation}) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    const [bio, setBio] = useState("");
    const [submit, setSubmit] = useState(false);

    
    useEffect(() => {
        console.log(props.currentUser);
        setName(props.currentUser.name);
        setUsername(props.currentUser.username);
        setWebsite(props.currentUser.website);
        setBio(props.currentUser.bio);
        
        if(submit){
            firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                name,
                username,
                website,
                bio,
            })
            alert("Save");
            props.navigation.navigate('Profile', {uid: firebase.auth().currentUser.uid});
        }
        setSubmit(false);
    }, [props.currentUser, submit])

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

    return (
        <View style = {styles.container}>
            <View style = {styles.headerContainer}>
                <Image 
                    style = {styles.avatar}
                    source ={{uri:"https://i.mydramalist.com/q65BQ_3f.jpg"}}
                />
                <View style = {styles.profileText}>
                    <Text>{props.currentUser.email}</Text>
                    <TouchableOpacity>
                        <Text style= {styles.changeProfilePhotoText}>
                            Change Profile Photo
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {styles.editInfoContainer}>
                <Text style = {styles.text}>Name</Text>
                <TextInput
                    style = {styles.infoInput}
                    value = {name}
                    numberOfLines= {1}
                    onChangeText = {(text) => {setName(text)}}
                />
                <Text style = {styles.text}>Username</Text>
                <TextInput
                    style = {styles.infoInput}
                    value = {username}
                    numberOfLines= {1}
                    onChangeText = {(text) => setUsername(text)}
                />
                <Text style = {styles.text}>Website</Text>
                <TextInput
                    style = {styles.infoInput}
                    value = {website}
                    numberOfLines= {1}
                    onChangeText = {(text) => setWebsite(text)}
                />
                <Text style = {styles.text}>Bio</Text>
                <TextInput
                    style = {styles.infoInput}
                    value = {bio}
                    multiline
                    numberOfLines= {4}
                    onChangeText = {(text) => setBio(text)}
                />

                
            </View>
        </View>
    )
}
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

// not calling anyaction so mapDispatchToProps = null
export default connect(mapStateToProps, null)(Edit);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        padding: 10,
        paddingLeft: 20,
        flexDirection: 'row',
        
    },
    avatar:{
        overflow: 'hidden',
        width: 80,
        height: 80,
        borderRadius: 150/2,
        borderWidth: 1,
        borderColor:'#ebebeb',
    }, 
    profileText:{
        justifyContent: 'center',
        marginLeft: 25,
    }, 
    changeProfilePhotoText:{
        color: "blue",
    },
    editInfoContainer: {
        flex: 1,
        padding: 5,
    },
    text: {
        marginVertical: 10,
        color: '#404040',
    },
    infoInput:{
        borderBottomColor:'#ebebeb',
        borderBottomWidth: 2,
        paddingVertical:3,
    },
});

  
  