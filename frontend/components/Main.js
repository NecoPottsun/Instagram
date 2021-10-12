import React, { Component } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { bindActionCreators } from 'redux';
import {fetchUser, fetchUserPosts, fetchUserFollowing, fetchClearData} from '../redux/actions/index';
import {connect} from 'react-redux';
import firebase from 'firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import SettingScreen from './main/Setting';
import SearchScreen from './main/Search';


const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
    return(null);
}
export class Main extends Component {
    componentDidMount(){
        this.props.fetchClearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
        const {currentUser} = this.props;
        if(currentUser == undefined){
            return(            
                <View></View>
            )
        }
        return (
            <Tab.Navigator initialRouteName="Feed"
                screenOptions = {{
                    tabBarStyle : {backgroundColor: '#ffffff',borderRadius: 50, marginLeft: 15,marginRight:15,}, 
                    tabBarLabelStyle : {color:'#5B5B5B', fontSize: 15,},
                    tabBarActiveTintColor : '#262626',
           
                
            }}
            >
                <Tab.Screen 
                    name= "Feed" 
                    component={FeedScreen} 
                    navigation = {this.props.navigation}
                    options= {{
                            tabBarShowLabel: false,
                            tabBarIcon: ({color,size}) => (
                                <MaterialCommunityIcons name="home-variant" color={color} size = {size} options />
                            )
                        }}
                    
                        
                />
                 <Tab.Screen 
                    name= "Search" 
                    component={SearchScreen} 
                    navigation = {this.props.navigation}
                    options= {{
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarIcon: ({color,size}) => (
                                <Ionicons name="search" color={color} size = {size} options />
                            )
                        }}
                        
                />
                <Tab.Screen name= "AddContainer" component= {EmptyScreen} 
                    listeners = {({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add");
                        }
                    })}
                    options = {{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name = "plus-box" color = {color} size= {size}/>
                        ),
                    }}
                />
                <Tab.Screen 
                    name= "Profile" 
                    component={ProfileScreen}
                    navigation = {this.props.navigation}
                    listeners = {({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile" , {uid: firebase.auth().currentUser.uid, refresh: true});
                        }
                    })} 
                    options= {{
                        tabBarShowLabel: false,
                        tabBarIcon: ({color,size}) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size = {size} options />
                        )
                    }}
                    
                />
                <Tab.Screen 
                    name= "Setting" 
                    component={SettingScreen} 
                    options= {{
                        tabBarShowLabel: false,
                        tabBarIcon: ({color,size}) => (
                            <MaterialIcons name="settings" color={color} size = {size} options />
                        )
                    }}
                    
                />
    
            </Tab.Navigator>

        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    fetchUserFollowing: store.userState.following,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing,fetchClearData}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    header: {
      fontSize : 24,
      fontWeight : 'bold',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    bottomNavigator:{
        backgroundColor: '#ffffff',
        color: '#423f3f',
    },
  });
  
  
  
  