import React, {useEffect, useLayoutEffect} from 'react'
import { connect } from 'react-redux'
import {View, Text, Image} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton, Colors } from 'react-native-paper';

import GallaryScreen from './avatar/Gallery'
import PhotoScreen from './avatar/Photo'

const Tab = createBottomTabNavigator();
export const EditAvatar = (props) => {
    useEffect(() => {

    console.log(props.currentUser);
        
    }, [props.currentUser])
    

    if(props.currentUser == undefined ){
        return(
            <View></View>
        )
    }
    return (
        <Tab.Navigator initialRouteName="Gallery">
            <Tab.Screen 
                name = "Gallery"
                component={GallaryScreen}
                navigation = {props.navigation}
                options = {{
                    headerLeft: () => (
                        <IconButton
                          icon = "keyboard-backspace"
                          color="#3c3c3c"
                          size={30}
                          style = {{padding: 15}}
                          onPress={() => props.navigation.goBack()}
                        />
                    )
                }}
            /> 
            <Tab.Screen 
                name = "Photo"
                component= {PhotoScreen}
                navigation = {props.navigation}
                options = {{
                    headerLeft: () => (
                        <IconButton
                          icon = "keyboard-backspace"
                          color="#3c3c3c"
                          size={30}
                          style = {{padding: 15}}
                          onPress={() => props.navigation.goBack()}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
})


export default connect(mapStateToProps, null)(EditAvatar)
