import React,{useState,useEffect} from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { events} from '../../constants/data';
import SelectDropdown from "react-native-select-dropdown"
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {auth, firestore_db, storage } from '../../firebaseConfig';
import {   getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { appSignOut, AuthStore } from '../../store';
import { router } from 'expo-router';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
const ScreenDimension=Dimensions.get('screen');

// category list
const categories=["football","chess","party","training","yoga"]

const CreateEvent = () => {
    const [selectedCategory,setSelectedCategory]=useState("");
    const [description,setDescription]=useState('');
    const [image,setImage]=useState(null);
    const [modalVisible,setModalVisible]=useState(true);
    const [uploading,setUploading]=useState(false);
    const [imageUrl,setImageUrl]=useState(null);
    const {user}=AuthStore.useState()
    const [eventDate,setEventDate]=useState("");
    const [region,setRegion]=useState("");

    //select image from library.....
    const selectImage=async ()=>{
        const saveImage=async (image)=>{
            try {
                setImage(image);
                setModalVisible(false);
            } catch (error) {
                
            }
        }
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                quality:1,
            })
            if(!result.canceled){
                //save image
                await saveImage(result.assets[0].uri);
            }
        } catch (err) {
            alert("Error upload image: "+err.message);
            setModalVisible(true);
            console.log(err.message)
        }
    }

    //upload image.....
     const uploadImage=async(image)=>{
        if(!image) {
            alert('select event image pls!! ');
            return;
        }
        setUploading(true);
        try{
            const {uri}=await FileSystem.getInfoAsync(image);
            const blob=await new Promise((resolve,reject)=>{
                const xhr=new XMLHttpRequest();
                xhr.onload=()=>{
                    resolve(xhr.response);
                };
                xhr.onerror=(e)=>{
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType="blob";
                xhr.open('GET',uri,true);
                xhr.send(null);
            });
            
            const filename=image.substring(image.lastIndexOf('/')+1);
            const imageRef=ref(storage,`images/${filename}`);
            
            await uploadBytes(imageRef,blob).then(()=>{
                console.log("image uploaded");
                setUploading(false)
                const storageRef = ref(storage, `images/${filename}`);
                getDownloadURL(storageRef).then((url) => {
                  setImageUrl(url);
                  console.log(imageUrl);
                }).catch((error) => {
                  console.log('Error getting download URL: ', error);
                });
            }).catch((e)=>{
                console.log(e.message)
                setUploading(false);
            })
        }catch(error){
            setUploading(false)
            console.log(error.message);
            
        }
    }
    //uploadPost
    const uploadPost=async()=>{
        
        if(!eventDate) alert("select event date pls !!");
        else if(!region) alert("select place of event pls !!");
        else if(!selectedCategory) alert ("select category of your event !! ")
        else{
            if(!image){
                alert("pls select image!!");
            }else{
                setUploading(true)
                try{
                    await uploadImage(image).then(async ()=>{
                        console.log(imageUrl,image)
                        if(!imageUrl) alert(" something went wrong, please try again!!")
                        else{
                            const docRef=collection(firestore_db,'events');
                            await addDoc(docRef,{
                                category:selectedCategory,
                                date:eventDate,
                                description:description,
                                eventImage:imageUrl,
                                region:region,
                                userId:auth.currentUser.uid}).then(()=>{
                                    alert('Event has been posted successfully');
                                    router.navigate('/(home)');
                                })
                    }

                    })
                }catch(e){
                    console.log(e)
                }finally{
                    setUploading(false)
                }
            }


            }

        }
    console.log(imageUrl,image)
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"white",padding:10,alignItems:"center",gap:20}}>
            <View style={{flexDirection:"row"}}>
                <Pressable style={{justifyContent:"center",alignItems:"center",position:"relative"}} onPress={()=>router.back()}>
                    <Ionicons name='arrow-back' size={25} />
                </Pressable>
                <Text style={{fontSize:20,margin:5,fontWeight:800}}>
                    CREATE EVENT
                </Text>
            </View>
            <View style={styles.header}>
                <View style={{
                            flexDirection:"row",
                            width:"100%",
                            gap:10,
                            margin:5,
                            marginTop:20,
                }}>
                     {
                        user?.userImage ?(
                        <Image source={{uri:user?.userImage}} width={50} height={50} style={{borderRadius:100}} />
                        ):
                        (
                        <Ionicons name='person' size={40} style={{borderRadius:100}}  />
                        )
                    }
                    <View >
                        <Text style={{fontSize:15,fontWeight:400}}>
                            {user?.userName}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={{justifyContent:"center",alignItems:"center",width:"auto",position:"relative",right:20,
                }} onPress={async()=>{
                    await appSignOut().then(()=>{
                        alert("signed out !!")
                    })
                }} ><Text style={{textAlign:"center",color:"#fff",backgroundColor:"#000",padding:10,borderRadius:5}} >Sign out</Text></TouchableOpacity>
            </View>
            <SelectDropdown
                data={categories}
                onSelect={(selectedItem, index) => {
                    setSelectedCategory(selectedItem);
                    console.log(selectedCategory,index)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
                showsVerticalScrollIndicator={false}
                buttonStyle={{
                    borderWidth:2,
                    borderRadius:10,
                    backgroundColor:"#fff",
                }}
                buttonTextStyle={{
                    fontSize:22,
                    fontWeight:500
                }}
                dropdownStyle={{
                    borderRadius:10,
                }}
                rowTextStyle={{
                    color:"gray",
                    fontWeight:500
                }}
                defaultValueByIndex={0}

            />
            {/* select region and date of the event  */}
            <KeyboardAvoidingView behavior={Platform.OS=="ios" ? "padding": "height"} style={{flexDirection:"row",width:"100%",gap:20,justifyContent:"center"}} >
                <View style={styles.textInputView}>
                    <Text style={styles.label}>Event Date</Text>
                    <TextInput
                    value={eventDate}
                    onChangeText={(text)=>setEventDate(text)}
                    style={styles.textInput}
                    placeholder='29 juin'
                    />
                </View>
                <View style={styles.textInputView}>
                    <Text style={styles.label}>Event place(region)</Text>
                    <TextInput
                    value={region}
                    onChangeText={(text)=>setRegion(text)}
                    style={styles.textInput}
                    placeholder='Gabes/tunis '
                    />
                </View>
            </KeyboardAvoidingView>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:"center",width:"100%",height:"auto",aspectRatio:1/1,gap:10}}>
                <View style={{justifyContent:"center",alignItems:"center",backgroundColor:"#C7C8CC",width:"100%",height:250,borderRadius:10}} >
                    <Pressable onPress={selectImage} style={{width:"100%",flex:1,justifyContent:"center",alignItems:"center"}} >
                        {modalVisible? (
                            <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{textAlign:"center",fontSize:15,color:"#fff",fontWeight:800}}>add Image</Text>
                                <Ionicons name='image-outline' size={100} color={"#fff"} />
                            </View>
                        ):(
                            <Image source={{uri:image}} style={{width:"100%",height:"100%",borderRadius:10}} />
                        )}
                    </Pressable>
                </View>
                <KeyboardAvoidingView style={styles.description}>
                    <TextInput placeholder="Add Description"  numberOfLines={5} multiline={true} style={styles.descriptionInput} onChangeText={(text)=>setDescription(text)} />
                </KeyboardAvoidingView>

            </ScrollView>
            <TouchableOpacity style={styles.postEventButton} onPress={uploadPost}>
                    {uploading ?(
                        <ActivityIndicator size='small' color="#fff" />
                    ):(
                        <Text style={{color:"#fff",fontSize:15,fontWeight:500}}>Post Event</Text>
                    )}
                </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CreateEvent;

styles=StyleSheet.create({
    header:{
        flexDirection:"row",
        width:"100%",
        paddingLeft:15,
        paddingRight:15,
        marginTop:20,
        alignSelf:"flex-start",
        justifyContent:"space-around"
        
    },
    userImage:{
        width:40,
        height:40,
        borderRadius:100
    },
    description:{
        width:ScreenDimension.width,
        height:"auto",
        justifyContent:"center",
        alignItems:"center",
        
    },
    descriptionInput:{
    width:"90%",
    height:"auto",
    borderWidth:1,
    textAlign:"center",
    fontSize:15,
    borderRadius:10
},
postEventButton:{
    width:"50%",
    height:50,
    backgroundColor:"#000",
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center"
},
textInputView:{
    width:"40%",
    alignItems:"center",
    gap:5,
    alignSelf:"flex-start",
},
textInput:{
    borderWidth:1,
    width:"100%",
    padding:5,
    borderRadius:5,
    paddingLeft:10
},
label:{
    fontSize:15,
    alignSelf:"flex-start"
}
})