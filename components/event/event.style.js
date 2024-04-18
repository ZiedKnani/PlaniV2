import { StyleSheet } from "react-native";


export const styles=StyleSheet.create({
    container:{
        marginTop:50,
        marginHorizontal:"5%",
    },
    TextInput:{
        width:'100%',
        flex:1,
        borderColor:"pink",
        borderWidth:2,
        padding:8,
        position:"relative"
    },
    header:{
        flexDirection:'row',
        justifyContent:"space-between",
        gap:10
    },
    headerText:{
        // fontFamily:"Roboto",
        fontSize:30,
        fontWeight:"700",
        marginTop:10,
        marginLeft:10,

    },
    eventHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:"100%",

    },
    button:{
        borderColor:"pink",
        borderWidth:2,
    }

})