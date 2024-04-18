import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router'
import { AuthStore } from '../store';
import 'expo-dev-client';
export default function Index(){
  const segments=useSegments();
  const router=useRouter();
  const navigationState=useRootNavigationState();
  const {initialized,isLoggedIn}=AuthStore.useState();
  useEffect(()=>{
    if(!navigationState?.key || !initialized) return;
    console.log(isLoggedIn,initialized)
    const inAuthGroup=segments[0]==="(auth)";
    if(
        //if user not signedIn and th initial segment is not anything
        //segment is not anything in the auth group. 
        !isLoggedIn && 
        !inAuthGroup
    ){
        router.replace('/(auth)/welcome')
        console.log("redirected to welcome page")

    }
    else if(isLoggedIn){
        //go to tabs route
        router.replace("/(home)")
        console.log("redirected to  home page")
    }
},[segments,navigationState?.key,initialized])

  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      {!navigationState?.key ? 
      <View>
        <Text style={styles.text}>Welcome Plani</Text>
        <ActivityIndicator color="#000" size="large" />
      </View>
      :<>
      <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
        <ActivityIndicator color="#000" size="large" />
      </View>
      </>}
    </View>
  )
}

const styles = StyleSheet.create({
  text:{
    fontSize:50
  }
})