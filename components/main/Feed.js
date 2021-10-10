import { mdiCompassOutline, mdiSelectionMarker } from '@mdi/js';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, useWindowDimensions, Button} from 'react-native'
import { IconButton, Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { connect } from 'react-redux';
import firebase from 'firebase';

require('firebase/firestore')



function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    //console.log(props.feed);
    // console.log(props.following.length)
    if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){

      props.feed.sort(function(y,x) {
        return x.creation.toDate() - y.creation.toDate();
      })
      setPosts(props.feed)
      console.log(posts);  
      // for(let i = 0; i < posts.length; i++){
      
      //   console.log(posts[i].user.name + " : " +posts[i].caption + " : "+posts[i].creation.toDate())
      // }
      setRefresh(false);
    }
  }, [refresh,props.usersFollowingLoaded, props.feed]) // need to add [...uid] because when props.route.params.uid is updated, the useEffect will be used, otherwise, it will run in an infinity loop
  


  const imageWidth = Math.floor(useWindowDimensions().width);

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const setLikePost = (postId, postUserId) => {
    firebase.firestore()
    .collection("posts")
    .doc(postUserId)
    .collection("userPosts")
    .doc(postId)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .set({})
    setRefresh(true);
  }
  const setUnlikePost  = (postId, postUserId) => {
    firebase.firestore()
    .collection("posts")
    .doc(postUserId)
    .collection("userPosts")
    .doc(postId)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .delete()
    setRefresh(true);
  }
  return (
    <View style = {styles.container}>
      <View style = {styles.containerGallery}>
        <FlatList 
          numColumns = {1}
          horizontal = {false}
          data = {posts}
          renderItem = {({item}) => (
            <View style = {styles.postContainer}>
              <Text style = {[styles.usernameText,{padding: 10, paddingLeft: 20,}]}>{item.user.name}</Text>
              <Image style = {styles.image,{width: imageWidth, height: imageWidth}}
                source= {{uri:item.downloadURL}}
              />
              <View style = {styles.buttonsContainer}>
                {item.currentUserLike ? (
                  <IconButton 
                  icon = "cards-heart"
                  color="#3c3c3c"
                  size={20}
                  style = {styles.iconButtonStyle}
                  onPress={() => setUnlikePost(item.id, item.user.uid)}
                />) : (
                  <IconButton 
                  icon = "heart-outline"
                  color="#3c3c3c"
                  size={20}
                  style = {styles.iconButtonStyle}
                  onPress={() => setLikePost(item.id, item.user.uid)}
                />
                )}
                <IconButton
                  icon = "chat-outline"
                  color="#3c3c3c"
                  size={20}
                  style = {styles.iconButtonStyle}
                  onPress={() => props.navigation.navigate('Comments', {post: item})}
                />
              </View>
              <View style = {styles.captionContainer}>
                <Text style = {styles.usernameText}>{item.user.name}</Text>
                <Text>{item.caption}</Text>
              </View>
              <Text style = {styles.uploadDateText}>{item.creation.toDate().toLocaleString('en-US', options)}</Text>
            </View>
          )}
          />
      </View>
    </View>
    )

    
};


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  currentUserPosts : store.userState.posts,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

// not calling anyaction so mapDispatchToProps = null
export default connect(mapStateToProps, null)(Feed);

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    banner:{
      backgroundColor: '#ffffff',
      alignItems: 'baseline',
      height: '10%',
    },
    headerText: {
      fontSize : 24,
      fontWeight : 'bold',
      color: '#423f3f',
      textAlign:'center',
    },
    containerInfo: {
      margin: 20,
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
    iconButtonStyle:{
      margin: 0
    },
    postContainer: {
      flex: 1,

    },
    buttonsContainer: {
      flexDirection:'row',
      paddingLeft: 5,
  
    },
    captionContainer: {
      flexDirection : 'row',
      marginLeft: 10,
      fontSize:16,
      
     },
    usernameText: {
      fontWeight: 'bold',
      marginRight: 8,
      
    },
    uploadDateText: {
      fontSize:11,
      margin: 10,
      color:'#b0b0b0'
    },  
  });
  
  
  