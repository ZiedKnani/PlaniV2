import React,{useState,useEffect} from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, FlatList, ActivityIndicator, Alert} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import { events } from '../../constants/data';
import { firestore_db } from '../../firebaseConfig';
import { collection, getDoc, getDocs, limit, limitToLast, onSnapshot, query, startAfter,where} from 'firebase/firestore';
import Event from '../../components/event/Event.js';
import { useRouter } from 'expo-router';
import SelectDropdown from "react-native-select-dropdown"
const categories = ["football", "chess", "party", "training", "yoga", "studies", "entertainment"];

const Index = () => {
    const [selectedFilterCategory, setSelectedFilterCategory] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [events, setEvents] = useState(null);
    const router=useRouter()
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsRef = collection(firestore_db, 'events');
                let eventsQuery = query(eventsRef);

                if (selectedFilters.length > 0) {
                    eventsQuery = query(eventsRef, where("category", "in", selectedFilters));
                }

                const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
                    const updatedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEvents(updatedEvents);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [selectedFilters]);

    const handleFilterDelete = (filter) => {
        const updatedFilters = selectedFilters.filter(item => item !== filter);
        setSelectedFilters(updatedFilters);
    };

    const renderSelectedFilters = () => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
                {selectedFilters.map((filter, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                        <Text>{filter}</Text>
                        <TouchableOpacity onPress={() => handleFilterDelete(filter)}>
                            <Ionicons name="close-circle" size={20} color="red" style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 5, marginTop: -35 }}>
            {/* input field and add button container  */}
            <View style={styles.container} >
                
                <View style={styles.header}>
                    
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 10 }}>
                      <Text style={styles.headerText}>
                        Discover
                </Text>
                <TouchableOpacity style={styles.button} onPress={()=>router.navigate('/createEvent')}>
                                <Ionicons name='add-outline' color="pink" size={30} />
                    </TouchableOpacity> 
                    
                </View>
                </View>
              
            
           
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
            <SelectDropdown style={{alignItems: 'center', paddingHorizontal: 10 }}
                    data={categories}
                    onSelect={(selectedItem, index) => {
                        setSelectedFilterCategory(selectedItem);
                        setSelectedFilters([...selectedFilters, selectedItem]);
                    }}buttonTextAfterSelection={(selectedItem, index) => {
                        // Conditionally render the text based on whether a filter is selected
                        return selectedFilterCategory ? selectedFilterCategory : "Filter";
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                    showsVerticalScrollIndicator={false}
                    buttonStyle={{
                        borderWidth: 2,
                        borderRadius: 10,
                        backgroundColor: "#fff",
                    }}
                    buttonTextStyle={{
                        fontSize: 22,
                        fontWeight: 500
                    }}
                    dropdownStyle={{
                        borderRadius: 10,
                    }}
                    rowTextStyle={{
                        color: "gray",
                        fontWeight: 500
                    }}
                    defaultValueByIndex={0}
                />
            {renderSelectedFilters()}</View>
            {events ? (
                <FlatList
                    data={events}
                    renderItem={({ item }) => <Event {...item} />}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                />
            ) : (
                <ActivityIndicator color="#000" size="large" style={{ marginTop: 20 }} />
            )}
        </SafeAreaView>
    );
};

export default Index;

const styles=StyleSheet.create({
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
        position:"relative",
        
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
