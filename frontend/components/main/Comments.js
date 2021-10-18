import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, FlatList, StyleSheet, useWindowDimensions, Image, Button} from 'react-native'
import firebase from 'firebase';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../../redux/actions/index'

require("firebase/firestore")
require("firebase/firebase-storage")

function Comments(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [postId, setPostId] = useState("");
    const [refresh, setRefresh] = useState(false);


    const imageWidth = Math.floor(useWindowDimensions().width);
    useEffect(() => {
        
        function matchUserToComment(comments){
            for( let i = 0; i < comments.length ; i++){
                if(comments[i].hasOwnProperty('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].userCommentId);
                if(user === undefined){
                    props.fetchUsersData(comments[i].userCommentId, false);
                }
                else{
                    comments[i].userCommentInfo = user;
                }
            }
            setComments(comments);
            console.log(comments);
            
        }

        setPostId(props.route.params.post.id);  
        // access to the dtb 
        firebase.firestore()
        .collection("posts")
        .doc(props.route.params.post.user.uid)
        .collection("userPosts")
        .doc(props.route.params.post.id)
        .collection("comments")
        .orderBy("timeComment", "desc")
        .get()
        .then((snapshot) => {
            if(!snapshot.empty){
                let postComments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data}
                })
                matchUserToComment(postComments);
            }
            
        })

        setRefresh(false);
        


    },[refresh,props.route.params.post.id,props.users]) 
    const createComment = () => {
        firebase.firestore()
        .collection("posts")
        .doc(props.route.params.post.user.uid)
        .collection("userPosts")
        .doc(props.route.params.post.id)
        .collection("comments")
        .add({
            text: comment,
            userCommentId: firebase.auth().currentUser.uid,
            timeComment: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setRefresh(true);

    }

    return (
        <View style = {styles.container}>
            <View style = {styles.postContainer}>  
                <Image style = {[styles.Image,{width: imageWidth, height: imageWidth}]} source = {props.route.params.post.downloadURL} />
                <View style = {styles.captionContainer}>
                    <Text style = {styles.usernameText}>{props.route.params.post.user.name}</Text> 
                    <Text>{props.route.params.post.caption}</Text>
                </View>
                <View style = {styles.commentContainer}>
                    <TextInput 
                        style = {styles.commentTextInput}
                        placeholder ="Write a comment here..." 
                        onChangeText = {(text) => setComment(text)}
                        onSubmitEditing = {(event) => console.log("aaaaaa")}
                    />
                    <Button 
                        title = "Upload"
                        onPress = {() => createComment()}
                    />
                </View>
                <FlatList 
                    numColumns = {1}
                    horizontal = {false}
                    data = {comments}
                    renderItem = {({item}) => 
                        <View style = {[styles.userCommentContainer]}>
                            {item.userCommentInfo !== undefined ? 
                                <Image 
                                    style = {[styles.avatar,{alignItems:'flex-start',alignSelf:'flex-start'}]}
                                    source ={item.userCommentInfo.avatarURL === "" ? 
                                    {uri:"https://i.mydramalist.com/q65BQ_3f.jpg"}
                                    :
                                    {uri: item.userCommentInfo.avatarURL}
                                    }
                                />         
                            : null}
                            <View style = {{flexDirection: 'row', flex: 1}}>
                                <Text style= {{flexWrap: 'wrap', flexDirection:'row',  overflow:'hidden' }} numberOfLines={10}>

                                    {item.userCommentInfo !== undefined ? 
                                        <Text style = {styles.usernameText}>{item.userCommentInfo.name}</Text>
                                    : <Text style = {styles.usernameText}>{item.userCommentId}</Text>}
                                    <Text style = {{alignSelf:'flex-start' ,overflow:'hidden'}}
                                        numberOfLines={10}>{item.text}</Text>

                                </Text>
                            
                            </View>
                        
                
                        </View>
                        
                
                }
                />
            </View>
            
        </View>
    )
}

const mapStateToProps = (store) => ({
    users : store.usersState.users,

})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch);
export default connect(mapStateToProps,mapDispatchToProps)(Comments);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    postContainer: {
        flex: 1,
    },
    Image: {

    },
    captionContainer: {
        flexDirection : 'row',
        marginLeft: 5,
        fontSize:16,
        marginVertical: 10,
    },
    usernameText: {
        fontWeight: 'bold',
        marginRight: 8,
        
        
    },
    commentContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        paddingLeft: 8,
        paddingRight: 8,

    },
    commentTextInput: {

        backgroundColor: '#fafafa',
        borderColor: '#e0e0e0',
        flex: 1,
        paddingLeft: 10,
        borderWidth: 2,
        borderRadius: 20,
    },
    userCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        
    },
    avatar:{
        overflow: 'hidden',
        width: 35,
        height: 35,
        borderRadius: 150/2,
        borderWidth: 1,
        borderColor:'#ebebeb',
        marginRight: 8,
        
      }, 
});
