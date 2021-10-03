import {USER_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA} from '../constants/index';
import firebase from 'firebase';

require('firebase/firestore')
export function fetchClearData(){
    return((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}
export function fetchUser() {
    return((dispatch) => {
        firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                const id = snapshot.id;
                dispatch({type: USER_STATE_CHANGE, currentUser: {...snapshot.data(), id}});
                console.log(id);
            }
            else{
                console.log("cannot retrieve user");
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
        .get()
        .then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const user = getState().userState.currentUser
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
                    dispatch(fetchUsersData(following[i])); // call a function in redux use dispatch(function())
                }
        })
    })
}
export function fetchUsersData(uid) {
   return((dispatch, getState) => {
       const found = getState().usersState.users.some(el => el.uid === uid);

       if(!found){
        firebase.firestore().collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                let user = snapshot.data();
                user.uid = snapshot.id;
                dispatch({type: USERS_DATA_STATE_CHANGE, user});
                dispatch(fetchUsersFollowingPosts(user.uid));
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
        .get()
        .then((snapshot) => {
            if(snapshot.docs[0] === undefined){
                
                
            }
            else{
                const uid = snapshot.docs[0].ref.path.split('/')[1];
                console.log({snapshot, uid});
                const user = getState().usersState.users.find(el => el.uid === uid);
    
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id , ...data, user};
                })
                console.log(posts);
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts ,uid});
                console.log(getState());
            }

        })
    })
}