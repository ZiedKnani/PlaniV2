import {useState,useEffect} from 'react'
import { firestore_db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export function useFetchData(id,document){

    const [isLoading,setIsloading]=useState(false);
    const [data,setData]=useState(null);
    const {error,setError}=useState(null);
    async function fetchData(){
        setIsloading(true)
        const docRef=doc(firestore_db,document,id);
        try {
            const docSnap = await getDoc(docRef);
            setData(docSnap.data())
            setIsloading(false)
            console.log(data)
            
        } catch(error) {
            console.log(error.message)
            setIsloading(false)
            setError("something wrong with this document!!");
            alert('there is an error');
        }finally{
            setIsloading(false)
        }
    }

    useEffect(()=>{
        fetchData();
    },[])



    return{isLoading,data,error}
}