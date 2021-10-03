import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, FlatList, StyleSheet, useWindowDimensions, Image} from 'react-native'

export default function Post(props) {
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);


    const imageWidth = Math.floor(useWindowDimensions().width);
    return (
        <View style = {styles.container}>
            <View style = {styles.postContainer}>  
                <Image style = {[styles.Image,{width: imageWidth, height: imageWidth}]} source = {props.route.params.post.downloadURL} />
                <View style = {styles.captionContainer}>
                    <Text style = {styles.usernameText}>{props.route.params.post.user.name}</Text> 
                    <Text>{props.route.params.post.caption}</Text>

                </View>
            </View>
            
        </View>
    )
}
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
        flex: 1,
        flexDirection : 'row',
        marginLeft: 5,
        fontSize:16,
    },
    usernameText: {
        fontWeight: 'bold',
        marginRight: 8,
        
    },
});
