import React, {useState, useEffect,useLayoutEffect, AsyncStorage } from 'react'
import {View, Text, StyleSheet, Button, Image, FlatList, useWindowDimensions,TouchableOpacity} from 'react-native'
import { useDeviceOrientation } from '@react-native-community/hooks';
import Feather from 'react-native-vector-icons/Feather';
import firebase from 'firebase'
import { IconButton, Colors } from 'react-native-paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchFollowersData } from '../../redux/actions/index'

function Profile(props) {
  const {landscape} = useDeviceOrientation();
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following,setFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followingOtherUsers, setFollowingOtherUsers] = useState([]);

  const [submit, setSubmit] = useState(false);
  useLayoutEffect(() => {
    if(props.route.params.uid === firebase.auth().currentUser.uid){
      props.navigation.setOptions({
        headerTitle: () => (
          <View style = {styles.header}>
            <Feather name="lock" color={'#5B5B5B'} size = {20} options />
            <Text style = {[styles.headerUsernameText,{marginLeft:10,}]}>{props.currentUser.username}</Text>
          </View>
        ),
        headerLeft: false,
      })
    }
    else{
      props.navigation.setOptions({
        headerTitle: () => (
          <Text style = {styles.headerUsernameText}>{props.route.params.username}</Text>
          ),
        headerLeft: () => (
          <IconButton
            icon = "keyboard-backspace"
            color="#3c3c3c"
            size={30}
            style = {{padding: 15}}
            onPress={() => setSubmit(true)}
          />
        )
      })
    }
  }, [props.navigation, props.route.params.uid, props.currentUser])



  useEffect(() => {
    const {currentUser, posts , currentUserFollowers} = props;
    if(submit){
      props.navigation.goBack();
    }
    if(props.route.params.uid === firebase.auth().currentUser.uid){
      setUser(currentUser);
      setUserPosts(posts);
      console.log(currentUserFollowers);
      matchFollowerData(currentUserFollowers);
      setFollowingOtherUsers(props.following);

    }
    else{
      firebase.firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if(snapshot.exists){
            setUser(snapshot.data());
          }
          else{
            console.log("cannot retrieve user");
          }
        })
      firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map(doc => {
            const data = doc.data();
            const uid = doc.id;
            return { uid , ... data };
          })
          setUserPosts(posts);
          
        })
      firebase.firestore()
        .collection("following")
        .doc(props.route.params.uid)
        .collection("userFollower")
        .onSnapshot((snapshot) => {
          let followers = snapshot.docs.map(doc => {
            const uid = doc.id;
            return uid;
          })
          matchFollowerData(followers);
          
        })
      firebase.firestore()
        .collection("following")
        .doc(props.route.params.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot) => {
          let followingOtherUsers = snapshot.docs.map(doc => {
            const uid = doc.id;
            return uid;
          })
          setFollowingOtherUsers(followingOtherUsers);

        })
        
      
    }
    function matchFollowerData (followers){
      for(let i = 0; i < followers.length; i++){
        if(followers[i].hasOwnProperty('followerInfo')){
          continue;
        }
        const user = props.followers.find(x => x.uid === followers[i])
        console.log(user);
        console.log(followers[i])
        if(user === undefined){
          props.fetchFollowersData(followers[i])
        }
        else{
          followers[i] = {followerInfo: user};
        }
        
      }
      setFollowers(followers);
      console.log(followers);
    }
    
    if(props.following.indexOf(props.route.params.uid) > -1){
      setFollowing(true);
    }
    else{
      setFollowing(false);
    }
    
    return () => {
      setSubmit(false)
      // setUserPosts([]);
      // setUser(null);
      // setFollowing(false);
      // setFollowers([]);
      // setFollowingOtherUsers([]);
      
    }

  }, [submit,props.route.params.uid, props.following,props.currentUser,props.users,props.followers,props.currentUserFollowers]) // need to add [...uid] because when props.route.params.uid is updated, the useEffect will be used, otherwise, it will run in an infinity loop
 

  const onUnfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
    setFollowing(false);
    firebase.firestore()
      .collection("following")
      .doc(props.route.params.uid)
      .collection("userFollower")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  }
  const onFollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
    setFollowing(true);
    firebase.firestore()
      .collection("following")
      .doc(props.route.params.uid)
      .collection("userFollower")
      .doc(firebase.auth().currentUser.uid)
      .set({});

  }

  const imageWidth = Math.floor(useWindowDimensions().width/3);
  
  if(user === null){
    return <View></View>
  }

  return (
      <View style={styles.container}>
        <View style = {styles.containerUpperInfo}>
          <Image 
            style = {styles.avatar}
            source ={user.avatarURL === "" ? 
                      {uri:"https://i.mydramalist.com/q65BQ_3f.jpg"}
                      :
                      {uri: user.avatarURL}
                    }
          />
          <View style = {{flexDirection:'row',flex: 1}}>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>{userPosts.length}</Text>
              <Text>Posts</Text>
            </View>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>{followers.length}</Text>
              <Text>Followers</Text>
            </View>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>{followingOtherUsers.length}</Text>
              <Text>Following</Text>
            </View>
          </View>


        </View>
        <View style = {styles.containerLowerInfo}>
          <View style = {styles.profileText}>
            <Text style = {{fontWeight: 'bold'}}>{user.name}</Text>
            <Text style = {{minWidth: 200,maxWidth: 200}}>{user.bio}</Text>
          </View>
          <View style = {styles.containerButton}>
            { // Following Button 
              // Check if it is the profile of the owner account
              props.route.params.uid !== firebase.auth().currentUser.uid ? 
                following ? (
                    <Button style = {styles.button}title = "Following" onPress = {() => onUnfollow()}/>
                  ) : (
                    <Button style = {styles.button} title = "Follow" onPress = {() => onFollow()} />
                ) : (
                <Button style = {styles.button}title = "Edit Profile" onPress = {() => props.navigation.navigate('Edit')} />
              )
            }
          </View>
        </View>
        
        <View style = {styles.containerGallery}>          
          <FlatList 
            numColumns= {3} 
            horizontal = {false}
            data = {userPosts}
            renderItem = {({item}) => 
              <View style = {styles.containerImage}> 
                {/* {console.log(item)} */}
                <TouchableOpacity onPress = {() => props.navigation.navigate('Comments', {post: item})}>
                  <Image 
                    style = {[styles.image, {width: imageWidth, height: imageWidth}]} // must draw the image with width and height
                    source = {{uri: item.downloadURL}}
                  />
                </TouchableOpacity>
              </View>
              
              
                
            }
          />

        </View>
      </View>
    )

    
};


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  currentUserFollowers: store.userState.followers,
  posts: store.userState.posts, 
  following: store.userState.following,
  followers: store.usersState.followers,
  users: store.usersState.users,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({fetchFollowersData}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header:{
      flexDirection: 'row',
    },
    headerUsernameText:{
      fontSize : 16,
      fontWeight : 'bold',
      textAlign:'center',
    },
    containerUpperInfo:{
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 10,
    },
    containerUpperInfoRightPane:{
      flex: 1,
      flexDirection:'column',
      justifyContent:'center',
      textAlign:'center',
      
    },
    containerLowerInfo: {
      flexDirection:'column',
      marginBottom: 10,
    }, 
    profileText:{
      justifyContent: 'center',
      marginLeft: 10,
    }, 
    containerGallery:{
      flex: 1,
      
    },
    containerImage: {
      flex: 1/3,

    },
    image: {
      flex: 1,
      aspectRatio: 1/1,
    },
    containerButton: {
      margin: 10
    },
    button: {

    },
    avatar:{
      overflow: 'hidden',
      width: 80,
      height: 80,
      borderRadius: 150/2,
      borderWidth: 1,
      borderColor:'#ebebeb',
    }, 

  });
  
  
  