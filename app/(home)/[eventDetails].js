import { doc,collection, getDoc } from 'firebase/firestore';
import React, {useState,useEffect} from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { firestore_db,auth } from '../../firebaseConfig';
import {useLocalSearchParams} from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import SvgComponent from '../../assets/chat';
import { useFetchData } from '../../hooks/useFetchSpecificData';
import { Dimensions } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useRouter } from 'expo-router';

import { addDoc,  setDoc } from 'firebase/firestore';

const ScreenDimension=Dimensions.get('screen');


const EventDetails = () => {
  const [isJoined, setIsJoined] = useState(false); // State to track join status
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState({});
  const params = useLocalSearchParams();
  const { data, isLoading, error } = useFetchData(params.eventDetails, "events");



  useEffect(() => {
    const checkUserJoined = async () => {
      try {
        const joinCollectionRef = collection(firestore_db, "joins");
        const joinQuery = query(joinCollectionRef, where("userId", "==", auth.currentUser.uid), where("eventId", "==", params.eventDetails));
        const joinSnapshot = await getDocs(joinQuery);
        if (!joinSnapshot.empty) {
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Error checking if user joined event:", error);
      }
    };
  
    checkUserJoined();
  }, [params.eventDetails]);

const handleJoin = async () => {
     // Optional: Set initial state before join attempt
    const userId = auth.currentUser.uid; // Replace with your logic to get user ID
    
    const eventId = params.eventDetails;
  
    try {
      const joinCollectionRef = collection(firestore_db, "joins");
      await addDoc(joinCollectionRef, {
        userId,
        eventId,
      }).then(()=>{
        alert("Joined Event !!")
    })
      console.log("Successfully joined event:", eventId);
      setIsJoined(true);
       // Update state after successful join
    } catch (error) {
      console.error("Error joining event:", error);
      // Handle other potential errors (e.g., display error message to user)
    }
  };
  async function fetchUserData() {
    const docRef = doc(firestore_db, "users", auth.currentUser.uid);
    try {
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (data) {
      fetchUserData();
      // Check if user already joined the event (logic based on your data structure)
      // For example, you can check if the user's ID exists in the participants array
      setIsJoined(data.participants && data.participants.includes(auth.currentUser.uid));
    }
  }, [data, isLoading]);

  // console.log(user)

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 15, alignItems: "center", justifyContent: "center" }}>
      {isLoading || !data ? (
        <ActivityIndicator color="#000" size='large' />
      ) : (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={styles.header}>
            <View style={{ flex: 1, marginTop: 10, margin: 10 }}>
              {/* on click on the image will navigate to event details */}
            </View>
            <View style={{ margin: 5 }}>
              <TouchableOpacity style={styles.userImage} onPress={() => router.navigate(`profile`)}>
                <Image source={{ uri: user.userImage }} />
              </TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {user.userName}
              </Text>
            </View>
          </View>
          <View style={{ width: "100%", alignItems: "center", marginVertical: 50, borderWidth: 2, padding: 10, borderRadius: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: 700 }}>
              {data.category}
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", width: ScreenDimension.width }}>
            <View style={{ width: "100%", height: 250 }}>
              <Image source={{ uri: data.eventImage }} resizeMode='contain' style={styles.eventImage} />
            </View>
           
                            <Text style={{fontWeight:500,textAlign:"left",padding:5,marginTop:10}}>
                                {data.description?? (
                                    <Text style={{fontSize:25}}>
                                        Description not available
                                    </Text>
                                )}
                            </Text>
                    </ScrollView>
                    <View style={{flexDirection:"row",gap:3}}>
                                <StarRating
                                     rating={rating}
                                     onChange={setRating}
      />
                                </View>
                    <View style={styles.bottomContainer}>
                    <TouchableOpacity style={{backgroundColor:"#fff",padding:10,borderRadius:10,width:"50%"}}  onPress={handleJoin}>
          
              <Text style={{textAlign:"center",fontSize:20,fontWeight:500}}>
                Join Event
              </Text>
            
            
          
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
