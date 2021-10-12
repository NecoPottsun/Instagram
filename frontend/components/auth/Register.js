import React, { Component } from 'react'
import {TextInput, View, Button} from 'react-native'

import firebase from 'firebase'
export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email :'',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp(){
        const { email,password,name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email,password) // (String,String)
        .then((result) => {
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({email, name}, {username:""},{website:""},{bio:""},{avatarURL: ""}); // because {...} is an object and .set(object)
            console.log(result)
        }).catch((error) => {  
            console.log(error);
        });
    }

    render() {
        return (
            <View> 
                <TextInput
                    placeholder = "name"
                    onChangeText = {(name) => this.setState({name})}
                />
                <TextInput
                    placeholder = "email"
                    onChangeText = {(email) => this.setState({email})}
                />
                <TextInput 
                    placeholder = "password"
                    secureTextEntry = {true}
                    onChangeText = {(password) => this.setState({password})}
                />
                <Button
                    onPress= {() => this.onSignUp()}
                    title = "Sign up"
                />
                
            </View>
        )
    }
}

export default Register
