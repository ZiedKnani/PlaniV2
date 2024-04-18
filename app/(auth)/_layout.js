import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Redirect, Slot, Stack, useRouter } from 'expo-router'
import { AuthStore } from '../../store'

const Layout = () => {
  const router=useRouter()
  const {isLoggedIn}=AuthStore.useState();
  useEffect(()=>{
    if(isLoggedIn) router.replace('/(home)');
  },[isLoggedIn])
  return (
    <Stack screenOptions={{headerShown:false}} initialRouteName='index' >
        <Stack.Screen name='login'/>
        <Stack.Screen name='register'/>
        <Stack.Screen name='welcome' options={{headerShown:false}} />
    </Stack>
  )
}

export default Layout

const styles = StyleSheet.create({})