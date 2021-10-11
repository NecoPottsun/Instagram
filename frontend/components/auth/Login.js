import React, { Component } from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import firebase from '../../Firebase'

export class Login extends Component {
    /* Create constructor */
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: '',
        }
        this.onLogin = this.onLogin.bind(this);
    }
    onLogin(){
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email,password).then((message) => {
            console.log(message);
        }).catch((errorMessage) => {
            console.log(errorMessage);
        })

    }
    render() {
        return (
            <View>
                <TextInput 
                    placeholder = "email"
                    onChangeText = {(email) => this.setState({email})}
                />
                <TextInput 
                    placeholder = "password"
                    onChangeText = {(password) => this.setState({password})}
                    secureTextEntry = {true}
                />
                <Button
                    title = "Login"
                    onPress = {() => this.onLogin()}

                />
            </View>
        )
    }
}

export default Login;
