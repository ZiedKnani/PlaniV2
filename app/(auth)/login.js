import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Platform } from "react-native";
import { appSignIn } from "../../store";
import {useFormik} from 'formik'
import { validationLoginForm } from "../../lib/validationForm";

const Login = () => {
  //const { email, password } = userInfo;
  const [onSubmit,setOnSubmit]=useState(false);
  const router=useRouter()


//login function 

  const formik = useFormik({
    initialValues:{email:"",password:""},
    validationSchema: validationLoginForm(), // validate the form data
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try { // send the data to Firebase
        setOnSubmit(true)
        await appSignIn(formValue.email,formValue.password).then((res)=>{
          router.replace('/(home)');
        })
      } catch (error) {
        // We use Toast to display errors to the user
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
    <Text style={styles.mainword}>Login</Text>
    <View>
      <Text style={styles.labelemail}>Email</Text>
      <TextInput
        style={styles.inputemail}
          label="Email"
          onChangeText={(text) =>formik.setFieldValue("email",text)}
          placeholder="example@email.com"
          autoCapitalize="none"
      />
      {
        formik.errors.email ? <Text style={{color:"red"}} >{formik.errors.email}</Text>:null
      }
      <Text style={styles.labelpass}>Password</Text>
      <TextInput
        style={styles.inputpass}
        label="Password"
        onChangeText={(text) => formik.setFieldValue("password",text)}
        placeholder="********"
        autoCapitalize="none"
        secureTextEntry
      />
      {
        formik.errors.password ? <Text style={{color:"red"}} >{formik.errors.password}</Text>:null
      }
    </View>

{/* //Login button /////////////////////////////// */}
    <View style={{position:"relative",top:40,width:"100%",justifyContent:"center",alignItems:"center"}}>
        <TouchableOpacity style={{backgroundColor:"#fff",padding:10,borderRadius:10,width:"50%"}} disabled={onSubmit} onPress={()=>formik.handleSubmit()}>
          {
            !onSubmit ?
            (
              <Text style={{textAlign:"center",fontSize:20,fontWeight:500}}>
                Login
              </Text>
            )
            :(
              <ActivityIndicator color="#000" size="small" />
            )
          }
        </TouchableOpacity>
    </View>
{/* //Login button /////////////////////////////// */}

    <TouchableOpacity
      style={{ marginTop: 30, paddingBottom: 50, top: 150 }}
      onPress={() => router.navigate('/register')}
    >
      <Text
        style={{
          color: "white",
          textDecorationLine: "underline",
          fontWeight: "bold",
          fontSize: 15,
        }}
      >
        Don't Have An Account ?
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

export default Login;
