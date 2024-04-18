import React,{useState,useEffect}from 'react';
import { ActivityIndicator, FlatList,Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { useFetchData } from '../../hooks/useFetchSpecificData';
import Ionicons from '@expo/vector-icons/Ionicons'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, firestore_db } from '../../firebaseConfig';
import Event from '../../components/event/Event';

const MyEvents = () => {
    const [text,setText]=useState('');
    const [isLoading,setIsloading]=useState(false);
    const[data,setData]=useState(null);
    async function  getEvents(){
        setIsloading(true)
        const collectionRef = collection(firestore_db, "events");
        try{
            const q = query(collectionRef, where("userId", "==", auth.currentUser.uid));

            const docSnap = await getDocs(q);
            const events=[]
            docSnap.forEach((doc,id) => {
                events.push({...doc.data(),id:doc.id});
                console.log(doc.data())
            });
            setData(events);
            setIsloading(false)
        }catch(e){
            console.log(e);
            setIsloading(false);
        }finally{
            setIsloading(false);
        }
    }
    useEffect(()=>{
        getEvents();
        console.log(data);
    },[])

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
                    MyEvents
            </Text>
        </View>
        {/* ********************************************* */}
        {/* Events container  */}
        <View style={{flex:1,marginHorizontal:10,justifyContent:"center",alignItems:"center"}} >
            {isLoading ? 

                        <ActivityIndicator color='#000' size="large" /> 
                    :
                    (
                    data &&  data.length!=0 ?
                    <FlatList
                    data={data}
                    renderItem={
                        ({item})=>{
                            return <Event {...item}/>
                        }
                    }
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={{marginVertical:5}}
                    
                    
                />
                :
                (
                    <View style={{alignItems:"center"}} >
                        <Text style={styles.noDatatext}>
                            You dont have any event 
                        </Text>
                        <Text style={{...styles.noDatatext,fontWeight:"700"}} >
                            Create <Text style={{color:"pink"}} >One</Text>
                        </Text>
                    </View>
                )
            )
            }
        </View>
        {/* **************************************** */}
    </SafeAreaView>
    );
};

export default MyEvents;


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
        marginVertical:15,
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
    },
    noDatatext:{
        fontSize:25,
        fontWeight:"300",
        color:"#000"
    }

})