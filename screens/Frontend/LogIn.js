import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { Platform } from "react-native";

const CustomButton = ({ title, onPress, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.customButton, buttonStyle]}
    >
      <Text style={[styles.customButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, Setpassword] = useState("");

  const checkuser = () => {
    // Your logic for checking user goes here
    // For example, you can perform validation and then navigate
    // navigation.navigate("Home");
  };

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
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <Text style={styles.labelpass}>Password</Text>
        <TextInput
          style={styles.inputpass}
          value={password}
          onChangeText={Setpassword}
          autoCapitalize="none"
          autoCompleteType="password"
          secureTextEntry={true}
        />
        <CustomButton
          title="Log In"
          onPress={checkuser}
          buttonStyle={{ marginTop: 30, borderRadius: 5 }}
          textStyle={{ fontSize: 20 }}
        />
      </View>
      <TouchableOpacity
        style={{ marginTop: 30, paddingBottom: 50, top: 150 }}
        onPress={() => navigation.navigate("Sign")}
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
        onPress={() => navigation.navigate("Forgot")}
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
    fontFamily: "Roboto",
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
  },
  labelpass: {
    marginTop: 20,
    fontFamily: "Roboto",
    //fontWeight: 400,
    fontSize: 12,
    color: "#FFFFFF",
  },
  labelemail: {
    marginTop: 20,
    fontFamily: "Roboto",
    //fontWeight: 400,
    fontSize: 12,
    color: "#FFFFFF",
  },
  inputemail: {
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
  },
  customButtonText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 7,
  },
});

export default LogIn;
