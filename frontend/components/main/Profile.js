import React, {useState, useEffect,useLayoutEffect, AsyncStorage } from 'react'
import {View, Text, StyleSheet, Button, Image, FlatList, useWindowDimensions,TouchableOpacity} from 'react-native'
import { useDeviceOrientation } from '@react-native-community/hooks';
import Feather from 'react-native-vector-icons/Feather';
import firebase from 'firebase'

import { connect } from 'react-redux';



function Profile(props) {
  const {landscape} = useDeviceOrientation();
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following,setFollowing] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useLayoutEffect(() => {
    if(props.route.params.uid === firebase.auth().currentUser.uid){
      props.navigation.setOptions({
        headerTitle: () => (
          <View style = {styles.header}>
            <Feather name="lock" color={'#5B5B5B'} size = {20} options />
            <Text style = {[styles.headerUsernameText,{marginLeft:10,}]}>{props.currentUser.username}</Text>
          </View>
        )
      })
    }
    else{
      props.navigation.setOptions({
        headerTitle: () => (
          <Text style = {styles.headerUsernameText}>{props.route.params.username}</Text>
        )
      })
    }
  }, [props.navigation, props.route.params.uid, props.currentUser])



  useEffect(() => {
    const {currentUser, posts} = props;
    // console.log("users: " + props.users)
    console.log("following: " +props.following)
    // const post = {...posts};
    getFollowers();
    if(props.route.params.uid === firebase.auth().currentUser.uid){
      setUser(currentUser);
      setUserPosts(posts);
 
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
       
        
    }
    
    if(props.following.indexOf(props.route.params.uid) > -1){
      setFollowing(true);
    }
    else{
      setFollowing(false);
    }
    

  }, [props.route.params.uid, props.following,props.currentUser,props.users]) // need to add [...uid] because when props.route.params.uid is updated, the useEffect will be used, otherwise, it will run in an infinity loop
  
  

  const onUnfollow = () => {
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .delete();
    setFollowing(false);
  }
  const onFollow = () => {
    firebase.firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .set({});
    setFollowing(true);

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
            source ={{uri:"https://i.mydramalist.com/q65BQ_3f.jpg"}}
          />
          <View style = {{flexDirection:'row',flex: 1}}>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>{userPosts.length}</Text>
              <Text>Posts</Text>
            </View>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>0</Text>
              <Text>Followers</Text>
            </View>
            <View style = {styles.containerUpperInfoRightPane}>
              <Text style= {{fontWeight: 'bold'}}>{props.following.length}</Text>
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
  posts: store.userState.posts, 
  following: store.userState.following,
  users: store.usersState.users,
})

// not calling anyaction so mapDispatchToProps = null
export default connect(mapStateToProps, null)(Profile);

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
  
  
  