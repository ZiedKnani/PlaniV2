import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router=useRouter();
  return (
    <SafeAreaView style={{flex:1,justifyContent:"center",alignItems:"center",position:"relative",backgroundColor:"#000"}}>
      <View style={styles.textWrapper}>
        <Text style={styles.mainTitle}>Plani</Text>
      </View>
    <View style={styles.buttonWrapper} >
        <TouchableOpacity style={styles.button} onPress={()=>router.push('/login')} >
            <Text style={styles.buttonText}>
                Get start
            </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default Welcome

const styles = StyleSheet.create({
    button:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#fff",
        padding:10,
        borderRadius:10
    },
    buttonText:{
        color:"#000",
        fontSize:22,
        fontWeight:"500",
        textAlign:"center",
    },
    buttonWrapper:{
        position:"absolute",
        width:"100%",
        bottom:0,
        padding:30
    },
    mainTitle:{
        color:"#fff",
        fontSize:60,
        borderWidth:2,
        borderColor:'#fff',
        padding:20,
        borderRadius:10
    }

})