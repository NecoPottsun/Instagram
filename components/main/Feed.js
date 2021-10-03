import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, useWindowDimensions} from 'react-native'

import { connect } from 'react-redux';



function Feed(props) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let posts = [];
    if(props.usersLoaded == props.following.length){
      for(let i = 0; i < props.following.length; i++){
        console.log(props.following[i]);
        const user = props.users.find(el => el.uid === props.following[i]);
        if(user != undefined){
          posts = [...posts, ...user.posts]
        }
      }
      posts.sort(function(y,x) {
        return x.creation.toDate() - y.creation.toDate();
      })

      setPosts(posts)
      console.log(posts);  
      for(let i = 0; i < posts.length; i++){
      
        console.log(posts[i].user.name + " : " +posts[i].caption + " : "+posts[i].creation.toDate())
      }

    }
  }, [props.usersLoaded]) // need to add [...uid] because when props.route.params.uid is updated, the useEffect will be used, otherwise, it will run in an infinity loop
  


  const imageWidth = Math.floor(useWindowDimensions().width);
  
  return (
    <View style = {styles.container}>
      <View style = {styles.containerGallery}>
        <FlatList 
          numColumns = {1}
          horizontal = {false}
          data = {posts}
          renderItem = {({item}) => (
            <TouchableOpacity onPress = {() => props.navigation.navigate('Comments', {post: item}) }>
              <View style = {{flex:1}}>
                <Text>User: {item.user.name}</Text>
                <Text>Caption: {item.caption}</Text>
                <Image style = {styles.image,{width: imageWidth, height: imageWidth}}
                  source= {{uri:item.downloadURL}}
                />
              </View>
            </TouchableOpacity>
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
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
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
    followButton: {

    },
  });
  
  
  