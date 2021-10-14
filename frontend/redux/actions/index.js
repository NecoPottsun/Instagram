import {USER_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE,USER_FOLLOWERS_STATE_CHANGE,FOLLOWERS_DATA_STATE_CHANGE,USERS_FOLLOWERS_STATE_CHANGE ,USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA,USERS_LIKES_STATE_CHANGE} from '../constants/index';
import firebase from 'firebase';

require('firebase/firestore')
export function fetchClearData(){
    return((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}
export function fetchUser() {
    return((dispatch) => {
        // firebase.firestore().collection("users")
        // .doc(firebase.auth().currentUser.uid)
        // .get()
        // .then((snapshot) => {
        //     if(snapshot.exists){
        //         const uid = snapshot.id;
        //         dispatch({type: USER_STATE_CHANGE, currentUser: {...snapshot.data(), uid}});
        //         console.log(uid);
        //     }
        //     else{
        //         console.log("cannot retrieve user");
        //     }
        // })
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                if(snapshot.exists){
                    const uid = snapshot.id;
                    dispatch({type: USER_STATE_CHANGE, currentUser: {...snapshot.data(), uid}});
                }
            })
    })
}


export function fetchUserPosts() {
    return((dispatch,getState) => {
        firebase.firestore().collection("posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .onSnapshot((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const user = getState().userState.currentUser;
                const data = doc.data();
                const id = doc.id;
                return { id , ...data, user};
            })
            console.log(posts);
            dispatch({type: USER_POST_STATE_CHANGE, posts});
        })
    })
}
export function fetchUserFollowing() {
    return((dispatch) => {
        firebase.firestore().collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id;
                return id;
            })
                
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
            for(let i = 0; i < following.length; i++){
                dispatch(fetchUsersData(following[i],true)); // call a function in redux use dispatch(function())
            }
        })
    })
}
export function fetchUserFollowers(){
    return((dispatch)=> {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollower")
            .onSnapshot((snapshot) => {
                let followers = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                dispatch({type: USER_FOLLOWERS_STATE_CHANGE, followers});
            })
    })
}
export function fetchUsersData(uid, getPosts) {
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        
        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;
                    dispatch({type: USERS_DATA_STATE_CHANGE, user});
                    if(getPosts){
                        dispatch(fetchUsersFollowingPosts(user.uid));
                    }
                    
                }
                else{
                    console.log("cannot retrieve user");
                }
            })
        }
    })
}
export function fetchUsersFollowingPosts(uid) {
    return((dispatch,getState) => {
        firebase.firestore().collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .onSnapshot((snapshot) => {
            if(snapshot.docs[0] === undefined){
            }
            else{
                const uid = snapshot.docs[0].ref.path.split('/')[1];
                // console.log({snapshot, uid});
                const user = getState().usersState.users.find(el => el.uid === uid);
    
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id , ...data, user};
                })
                for(let i = 0; i < posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                // console.log(posts);
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts ,uid});
                // console.log(getState());
            }
            
        })
    })
}
export function fetchUsersFollowers(uid){
    return((dispatch, getState)=> {
        firebase.firestore()
            .collection("following")
            .doc(uid)
            .collection("userFollower")
            .onSnapshot((snapshot) => {
                if(snapshot.docs[0] === undefined){

                }
                else{
                    const uid = snapshot.docs[0].ref.path.split('/')[1];
                    const user = getState().usersState.users.find(el => el.uid === uid);

                    let usersFollowers = snapshot.docs.map(doc =>{
                        const followerId = doc.id;
                        return {followerId, user, uid};
                    })
                    dispatch({type: USERS_FOLLOWERS_STATE_CHANGE, usersFollowers})
                }
            })
    })
}
export function fetchUsersFollowingLikes(uid, postId) {
    return((dispatch,getState) => {
        firebase.firestore().collection("posts")
        .doc(uid)
        .collection("userPosts")
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid) 
        .onSnapshot((snapshot) => {
            const postId =  snapshot.ref.path.split('/')[3];
            let currentUserLike = false;
            if(snapshot.exists){ // if the currentUser id is inside the firestore to know that this current person had liked the current post
                currentUserLike = true;
            }
            // console.log("postID: " + postId + " currentUserLike: " + currentUserLike)
            dispatch({type: USERS_LIKES_STATE_CHANGE, postId ,currentUserLike});
            // console.log(getState());
        })
    })
}
export function fetchFollowersData(uid){
    return((dispatch, getState) => {
        console.log(uid);
        if(uid === ""){

        }
        else{
            const found = getState().usersState.followers.some(el => el.uid === uid)
            if(!found){
                firebase.firestore()
                    .collection("users")
                    .doc(uid)
                    .onSnapshot((snapshot) =>{
                        if(snapshot.exists){
                            let follower = snapshot.data();
                            follower.uid = snapshot.id;
                            console.log(follower);
                            dispatch({type: FOLLOWERS_DATA_STATE_CHANGE, follower})
                        }
                        else{
                            console.log("data not exist");
                        }
                    })
            }

        }
    })
}