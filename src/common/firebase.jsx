import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth,signInWithPopup  } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDb9NzEmumz1cSWja8sGGJxqU09hSSD-zI",
    authDomain: "reactjsblogapplication.firebaseapp.com",
    projectId: "reactjsblogapplication",
    storageBucket: "reactjsblogapplication.appspot.com",
    messagingSenderId: "745158635595",
    appId: "1:745158635595:web:af14b855fb0052c8121dce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth


const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authwithgoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
        }).catch((error) => {
            console.log(error.message);
        });

    return user;

}

export default app;










