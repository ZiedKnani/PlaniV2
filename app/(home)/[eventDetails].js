import { doc, getDoc } from 'firebase/firestore';
import React, {useState,useEffect} from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore_db } from '../../firebaseConfig';
import {useLocalSearchParams} from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import SvgComponent from '../../assets/chat';
import { useFetchData } from '../../hooks/useFetchSpecificData';
import { Dimensions } from 'react-native';
const ScreenDimension=Dimensions.get('screen');
const EventDetails = () => {

    const[user,setUser]=useState({});
    const params=useLocalSearchParams();
    const{data,isLoading,error}=useFetchData(params.eventDetails,"events");
    async function fetchUserData(){
        const docRef=doc(firestore_db,"users",data.userId);
        try {
            const docSnap = await getDoc(docRef);
            setUser(docSnap.data())
        } catch(error) {
            console.log(error.message)
        }
    }
    useEffect(()=>{
        if(data) fetchUserData();
    },[data,isLoading])
    // console.log(user)

    return (
        <SafeAreaView style={{flex:1,marginHorizontal:15,alignItems:"center",justifyContent:"center"}}>
            {isLoading || !data?(
                <ActivityIndicator  color="#000" size='large'/>
            )
            :
            (<View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={styles.header}>
                            <Image source={{uri:user.userImage}} style={styles.userImage} />
                            <View>
                                <Text style={{fontSize:14,fontWeight:500}}>
                                    {user.userName}
                                </Text>
                                <View style={{flexDirection:"row",gap:3}}>
                                    <Ionicons name='star' color='#FCDC2A' size={15} />
                                    <Ionicons name='star' color='#FCDC2A' size={15} />
                                    <Ionicons name='star' color='#FCDC2A' size={15} />
                                    <Ionicons name='star-half' color='#FCDC2A' size={15} />
                                </View>
                            </View>
                        </View>
                    <View style={{width:"100%",alignItems:"center",marginVertical:50,borderWidth:2,padding:10,borderRadius:10}}>
                        <Text style={{fontSize:22,fontWeight:700}}>
                            {data.category}
                        </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:"center",width:ScreenDimension.width}} >
                        <View style={{width:"100%",height:250}}>
                            <Image source={{uri:data.eventImage}} resizeMode='contain' style={styles.eventImage} />
                        </View>
                            <Text style={{fontWeight:500,textAlign:"left",padding:5,marginTop:10}}>
                                {data.description?? (
                                    <Text style={{fontSize:25}}>
                                        Description not available
                                    </Text>
                                )}
                            </Text>
                    </ScrollView>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.joinButton} >
                            <Text style={{color:"#fff",textAlign:"center"}} >Join Event</Text>
                        </TouchableOpacity>
                        <Pressable onPress={()=>{}} >
                            <SvgComponent width={70} height={70} text="Join chat" />
                        </Pressable>
                    </View>
            </View>
            )}
        </SafeAreaView>
    );
};

export default EventDetails;

const styles=StyleSheet.create({
    header:{
        flexDirection:"row",
        width:"100%",
        gap:10,
        margin:5,
        marginTop:20,
        alignSelf:"flex-start"

    },
    userImage:{
        width:40,
        height:40,
        borderRadius:100
    },
    eventImage:{
        width:"100%",
        height:"100%"
    },
    bottomContainer:{
        position:"relative",
        flexDirection:"row",
        justifyContent:"space-evenly",
        gap:30,
        alignItems:"center",
        paddingVertical:10,
        bottom:0,
        width:"100%"
    },
    joinButton:{
        backgroundColor:"#000",
        width:"60%",
        padding:10,
        borderRadius:10
    }
})