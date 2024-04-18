import { View, Text, Image, Pressable, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, Slot, Stack, useRouter } from 'expo-router'
import { AuthStore } from '../../store'
import { events } from '../../constants/data'
import { Ionicons } from '@expo/vector-icons'
const Layout = () => {
  const router=useRouter()
  const {isLoggedIn,user}=AuthStore.useState();
  useEffect(()=>{
    if(!isLoggedIn ||!user) router.replace('/') ;
  },[isLoggedIn,user])
  console.log("home Layout")
  return (
    <Stack >
      <Stack.Screen options={{
        headerLeft:(()=>
          <Pressable style={{
                      flexDirection:"row",
                      width:"100%",
                      gap:10,
                      margin:5,
                      alignItems:"center"
          }} onPress={()=>router.navigate("/myEvents")}>
              {
                user ? (
                  user.userImage ?(
                    <Image source={{uri:user?.userImage}} width={40} height={40} style={{borderRadius:100}} />
                  ):
                  (
                    <Ionicons name='person' size={30} style={{borderRadius:100}}  />
                  )
                ): null
              }
              <View >
                  <Text style={{fontSize:20,fontWeight:500}}>
                      {user?.userName}
                  </Text>
              </View>
          </Pressable>  
        ),
        title:null,
        headerShadowVisible:false,

      }}  name='index'  />
      <Stack.Screen name="createEvent" options={{headerShown:false}} />
      <Stack.Screen name="[eventDetails]" options={{headerShown:false}} />
    </Stack>
  )
}

export default Layout