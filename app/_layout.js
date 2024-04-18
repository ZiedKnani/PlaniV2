import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView} from "react-native-gesture-handler"
import { Slot, Stack } from 'expo-router'
const Layout = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
        <Slot initialRouteName='index' />
    </GestureHandlerRootView>
  )
}

export default Layout