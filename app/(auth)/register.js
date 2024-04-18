import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { Platform } from "react-native";
import {appSignUp, AuthStore} from "../../store"
import { useFormik } from "formik";
import { validationRegisterForm } from "../../lib/validationForm";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig";
const Register = () => {
  //const { email, password } = userInfo;
  const [onSubmit,setOnSubmit]=useState(false);
  const [image,setImage]=useState(null);
  const [modalVisible,setModalVisible]=useState(true);
  const [imageUrl,setImageUrl]=useState(null);
  const router=useRouter()


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
          const imageRef=ref(storage,`userImages/${filename}`);
          
          await uploadBytes(imageRef,blob).then(()=>{
              console.log("image uploaded");
  
              const storageRef = ref(storage, `userImages/${filename}`);
              getDownloadURL(storageRef).then((url) => {
                setImageUrl(url);
                console.log(imageUrl);
              }).catch((error) => {
                console.log('Error getting download URL: ', error);
              });
          }).catch((e)=>{
              console.log(e.message);
          })
      }catch(error){
          console.log(error.message);
          
      }
  }

  //register user 
  const formik = useFormik({
    initialValues:{userName:"",email:"",password:""},
    validationSchema:validationRegisterForm(), // validate the form data
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try { // send the data to Firebase
        setOnSubmit(true)
        await uploadImage(image).then(async ()=>{
          if(!imageUrl) alert('something went wrong , please try again!');
          else{
            await appSignUp(formValue.userName,formValue.email,formValue.password,imageUrl).then(()=>{
              alert("registered with success!!");
              router.replace('/login');
          })
          }
        })
        // console.log(formValue.userName)
      } catch (error) {
        console.log(error)
      }finally{
        setOnSubmit(false)
      }
    },
  })
 return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
      <View style={{justifyContent:"center",alignItems:"center",backgroundColor:"#fff",width:60,height:60,borderRadius:100,marginVertical:20}} >
        <Pressable onPress={selectImage} style={{width:"100%",flex:1,justifyContent:"center",alignItems:"center"}} >
            {modalVisible? (
              
                <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                    <Ionicons name='person' size={20} color={"#000"} />
                </View>
            ):(
                <Image source={{uri:image}} style={{width:"100%",height:"100%",borderRadius:100}} />
            )}
        </Pressable>
    </View>
    <View>
      <Text style={styles.mainword}>Register</Text>
    </View>
    <View>
      <Text style={styles.labelemail}>userName</Text>
      <TextInput
        style={styles.inputemail}
          label="userName"
          onChangeText={(text) => formik.setFieldValue("userName",text)}
          placeholder="exemple"
      />
      {
        formik.errors.userName ? <Text style={{color:"red"}} >{formik.errors.userName}</Text>: null
      }
      <Text style={styles.labelemail}>Email</Text>
      <TextInput
        style={styles.inputemail}
          label="Email"
          onChangeText={(text) => formik.setFieldValue("email",text)}
          placeholder="example@email.com"
          autoCapitalize="none"
      />
            {
        formik.errors.email ? <Text style={{color:"red"}} >{formik.errors.email}</Text>: null
      }
      <Text style={styles.labelpass}>Password</Text>
      <TextInput
        style={styles.inputpass}
        label="Password"
        onChangeText={(text) => formik.setFieldValue('password',text)}
        placeholder="********"
        autoCapitalize="none"
        secureTextEntry
      />
      {
        formik.errors.password ? <Text style={{color:"red"}} >{formik.errors.password}</Text>: null
      }
    </View>
    <View style={{position:"relative",top:40,width:"100%",justifyContent:"center",alignItems:"center"}}>
        <TouchableOpacity style={{backgroundColor:"#fff",padding:10,borderRadius:10,width:"50%"}} disabled={onSubmit}  onPress={()=>formik.handleSubmit()}>
        {
          !onSubmit ?(
            <Text style={{textAlign:"center",fontSize:20,fontWeight:500}}>
            Register
        </Text>
          ):(
            <ActivityIndicator color="#000" size="small" />
          )
        }
        </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={{ marginTop: 30, paddingBottom: 50, top: 150 }}
      onPress={() =>router.navigate('/login')}
    >
      <Text
        style={{
          color: "white",
          textDecorationLine: "underline",
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Have An Account ?
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{ marginTop: 30, paddingBottom: 50, top: 112 }}
      onPress={() => {}}
    >
      <Text
        style={{
          color: "white",
          textDecorationLine: "underline",
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Forgot Your Password ?
      </Text>
    </TouchableOpacity>
  </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
mainword: {
  marginBottom: 20,
  fontStyle: "normal",
  //fontWeight: 800,
  fontSize: 40,
  lineHeight: 40,
  color: "#FFFFFF",
},
facebook: {
  marginTop: 13,
  resizeMode: "contain",
  borderWidth: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: 20,
  position: "absolute",
  width: 120,
  height: 40,
  left: 30,
  top: 480,
},
google: {
  marginTop: 13,
  resizeMode: "contain",
  borderWidth: 2,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: 20,
  position: "absolute",
  width: 120,
  height: 37,
  left: 250,
  top: 480,
},
foot2: {
  marginTop: 35,
},
foot1: {
  marginTop: 40,
  paddingTop: 40,
},
continue: {
  //fontWeight: 400,
  fontSize: 14,
  lineHeight: 20,
  marginTop: 10,
  color: "white",
},
customButton: {
  backgroundColor: "#334155",
  height: 40,
},
container: {
  flex: 1,
  width: "100%",

  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000000",
},
inputpass: {
  width: 300,
  borderBottomWidth: 1,
  borderBottomColor: "#FFFFFF",
  color:"#FFFFFF"
},
labelpass: {
  marginTop: 20,
  //fontWeight: 400,
  fontSize: 12,
  color: "#FFFFFF",
},
labelemail: {
  marginTop: 20,
  //fontWeight: 400,
  fontSize: 12,
  color: "#FFFFFF",
},
inputemail: {
  width: 300,
  borderBottomWidth: 1,
  borderBottomColor: "#FFFFFF",
  color:"#FFFFFF"
},
customButtonText: {
  color: "#fff",
  textAlign: "center",
  marginTop: 7,
},
});

export default Register;
