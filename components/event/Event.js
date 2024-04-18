import React,{useEffect,useState} from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styles } from './event.style';
import { doc, getDoc, onSnapshot, where } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import {useRouter} from 'expo-router'
import { useFetchData } from '../../hooks/useFetchSpecificData';
import { Ionicons } from '@expo/vector-icons';
const Event = ({eventImage,date,region,category,userId,id}) => {
    const router=useRouter()
    // fetch user data by userID  from fire base with use fetchData customized hook ;
        const {data:userData,isLoading}=useFetchData(userId,"users");
    return (
        <View  style={{width:"100%",flex:1,marginTop:20}} >
            {
                // Rendering user data to show it in the component 
                 !isLoading && userData ?(
                    <View style={styles.eventHeader}>
                    <View style={{flexDirection:"row",gap:5,alignItems:"center",justifyContent:"center"}}>
                        {
                            userData.userImage ?(
                            <Image source={{uri:userData.userImage}} width={40} height={40} style={{borderRadius:100}} />
                            ):
                            (
                            <Ionicons name='person'size={20} style={{borderRadius:100}}  />
                            )
                        }
                        <View style={{}}>
                            <Text>{userData.userName}</Text>
                            <Text style={{marginLeft:8,marginBottom:8,fontSize:12,fontFamily:"Roboto",fontWeight:"200",color:"gray"}} >{category} </Text>
                        </View>
                    </View>
                    <View style={{justifyItems:"center",alignItems:"center"}} >
                        <Text>{date}</Text>
                        <Text>{region}</Text>
                    </View>
                </View>
                ):null
            }
            {/* event image */}
        <View style={{flex:1,height:250,marginTop:10}}>
            {/* on click on the image will navigate to event details */} 
            <Pressable style={{flex:1}} onPress={()=>router.push(`/${id}`)}>    
                <Image source={{uri:eventImage}}
                style={{width:"100%",height:"100%"}}  
                resizeMode="stretch"   />
            </Pressable>
        </View>
</View>
    );
};

export default Event;