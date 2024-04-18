import { registerInDevtools, Store } from "pullstate";
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,updateProfile,onAuthStateChanged}from 'firebase/auth'

import {auth,firestore_db} from './firebaseConfig'

import { doc, getDoc, setDoc } from "firebase/firestore";

// function generateToken(n:number) {
//     var chars = process.env.EXPO_PUBLIC_TOKEN_kEY;
//     var token=null;
//     for(var i = 0; i < n; i++) {
//         token += chars[Math.floor(Math.random() * chars.length)];
//     }
//     return token;
// }
interface authStoreProps{
    isLoggedIn:boolean;
    initialized:boolean,
    user:{email:string,userImage?:string|null,userName:string}| any;
}
export const AuthStore=new Store<authStoreProps>({
    isLoggedIn:false,
    initialized:true,
    user:null
})

const unsub=onAuthStateChanged(auth,(user)=>{
    AuthStore.update((store)=>{
        store.user=user; 
        store.initialized=true;
        store.isLoggedIn=user?.uid ? true:false;
    })
})


export const appSignIn=async(email:string,password:string)=>{
    try {
        let user=null;
        await signInWithEmailAndPassword(auth,email,password).then(async ()=>{
                const docSnapsot=await getDoc(doc(firestore_db,'users',auth.currentUser.uid));
                user=docSnapsot.data();
            })
            .catch((error)=>{
                alert("user not available with this informations");
            })
        AuthStore.update((store)=>{
            store.user=user;
            store.isLoggedIn=user ? true:false;

        });
        return user ?? {user:auth.currentUser};
    } catch (error) {
        return {error:error}
    }
}

export const appSignOut=async ()=>{
    try {
        await signOut(auth);
        AuthStore.update((store)=>{
            store.user=null;
            store.isLoggedIn=false;

        })
        return {user : null};
    } catch (error) {
        return {error:error}
    }
}


export const appSignUp=async(userName:string,email:string,password:string,userImage:string)=>{
    try {
        let user={};
        const res=await createUserWithEmailAndPassword(auth,email,password).then(async()=>{
            await setDoc(doc(firestore_db,'users',auth.currentUser.uid),{
                userName,
                userImage,
                email,
            })}).then(async ()=>{
                const docSnapsot=await getDoc(doc(firestore_db,'users',auth.currentUser.uid));
                user=docSnapsot.data();
            })
        AuthStore.update((store)=>{
            store.user=user;
            store.isLoggedIn=true;
    
        });
        return user ?? {user:auth.currentUser};
    } catch (error) {
        return {error:error}
    }
    };

    
registerInDevtools({AuthStore});