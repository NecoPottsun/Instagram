import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet, Button, Image, FlatList, useWindowDimensions,TouchableOpacity} from 'react-native'
import { useDeviceOrientation } from '@react-native-community/hooks';
import firebase from 'firebase'

import { connect } from 'react-redux';



function Profile(props) {
  const {landscape} = useDeviceOrientation();
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following,setFollowing] = useState(false);
  

  useEffect(() => {
    const {currentUser, posts} = props;
    const post = {...posts};
 

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

   
  }, [props.route.params.uid, props.following]) // need to add [...uid] because when props.route.params.uid is updated, the useEffect will be used, otherwise, it will run in an infinity loop
  
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
        {/* <View style = {styles.banner}>
          <Text style = {[styles.headerText, {paddingLeft: landscape ? '2%' : '5%', paddingVertical: landscape ? '' : '5%',}]}>Profile</Text>
        </View> */}
        <View style = {styles.containerInfo}>
          
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          { // Following Button 
            // Check if it is the profile of the owner account
            props.route.params.uid !== firebase.auth().currentUser.uid ? (
              <View>
                {following ? (
                  <Button style = {styles.followButton}title = "Following" onPress = {() => onUnfollow()}/>
                ) : (
                  <Button style = {styles.followButton} title = "Follow" onPress = {() => onFollow()} />
                )}

              </View>
            ) : null
          }
        </View>
        <View style = {styles.containerGallery}>          
          <FlatList 
            numColumns= {3} 
            horizontal = {false}
            data = {userPosts}
            renderItem = {({item}) => 
              <View style = {styles.containerImage}> 
                {console.log(item)}
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
})

// not calling anyaction so mapDispatchToProps = null
export default connect(mapStateToProps, null)(Profile);

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
  
  
  