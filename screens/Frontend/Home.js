import React,{useState,useEffect} from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, ActivityIndicator, Alert} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { events } from '../../constants/data';
import { firestore_db } from '../../firebaseConfig';
import { collection, getDoc, getDocs, limit, limitToLast, onSnapshot, query, startAfter} from 'firebase/firestore';
import Event from '../../components/event/Event.js';


const Home = () => {
    const [text,setText]=useState('');
    //get user logic ; 
    const [events,setEvents]=useState(null)
    const eventsRef=collection(firestore_db,'events');

    useEffect(()=>{
        const subscriber=onSnapshot(eventsRef,{
            next:(snapshot)=>{
                const evts=[];
                snapshot.forEach(doc => {
                    evts.push({
                        id:doc.id,
                        ...doc.data(),
                    })
                });     
                setEvents(evts);
            }   
        })
    },[])
    console.log(events)
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"white",paddingHorizontal:5}}>

            {/* input field and add button container  */}
            <View style={styles.container} >
                <View style={styles.header}>
                    <TextInput
                        onChangeText={(text)=>setText(text)}
                        value={text}
                        style={styles.TextInput}
                        placeholder="Search all events"
                     />
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity style={styles.button} onPress={()=>{}}>
                                <Ionicons name='add-outline' color="pink" size={30} />
                    </TouchableOpacity> 
                </View>
                </View>
                <Text style={styles.headerText}>
                        Discover
                </Text>
            </View>
            {/* ********************************************* */}
            {/* Events container  */}
            <View style={{flex:1,marginHorizontal:10,justifyContent:"center",alignItems:"center"}} >
                {events ? 
                                <FlatList
                                data={events}
                                renderItem={
                                    ({item})=>{
                                        return <Event {...item}/> 
                                    }
                                }
                                keyExtractor={item => item.id}
                                showsVerticalScrollIndicator={false}
                                style={{marginVertical:5}}
                                
                            />
                            :<ActivityIndicator color="#000" size="large" /> }

            </View>
            {/* **************************************** */}
        </SafeAreaView>
    );
};




export default Home;

const styles=StyleSheet.create({
    container:{
        marginTop:50,
        marginHorizontal:"5%",
    },
    TextInput:{
        width:'100%',
        flex:1,
        borderColor:"pink",
        borderWidth:2,
        padding:8,
        position:"relative",
        
    },
    header:{
        flexDirection:'row',
        justifyContent:"space-between",
        gap:10
    },
    headerText:{
        // fontFamily:"Roboto",
        fontSize:30,
        fontWeight:"700",
        marginTop:10,
        marginLeft:10,

    },
    eventHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",

    },
    button:{
        borderColor:"pink",
        borderWidth:2,
    }

})