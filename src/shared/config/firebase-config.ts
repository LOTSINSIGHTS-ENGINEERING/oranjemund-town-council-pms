import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
// Your web app's Firebase configuration  *in production
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuZLqeKLZ5OU0nW8kcKFlMX2eg6f_pEUA",
  authDomain: "oranjemund-town-council-38942.firebaseapp.com",
  projectId: "oranjemund-town-council-38942",
  storageBucket: "oranjemund-town-council-38942.appspot.com",
  messagingSenderId: "867625115879",
  appId: "1:867625115879:web:37beb38f9edc75a3c30242",
};


//testing on ijg
// const firebaseConfig = {
//   apiKey: "AIzaSyDVI2yHFy2ERdqbYh5gplruXOhJsMuSUlc",
//   authDomain: "ijgmms.firebaseapp.com",
//   projectId: "ijgmms",
//   storageBucket: "ijgmms.appspot.com",
//   messagingSenderId: "69645852108",
//   appId: "1:69645852108:web:c2e4b9cf346860d5fa5169"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuthWorker = initializeApp(firebaseConfig, "authWorker");

export const auth = getAuth(app);
export const authWorker = getAuth(appAuthWorker);

export const analytics = getAnalytics(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const storage = getStorage(app);
export const functions = getFunctions(app);

// ORANJEMUND
//  apiKey: "AIzaSyAuZLqeKLZ5OU0nW8kcKFlMX2eg6f_pEUA",
//   authDomain: "oranjemund-town-council-38942.firebaseapp.com",
//   projectId: "oranjemund-town-council-38942",
//   storageBucket: "oranjemund-town-council-38942.appspot.com",
//   messagingSenderId: "867625115879",
//   appId: "1:867625115879:web:37beb38f9edc75a3c30242",

// OMUTHIYA
// apiKey: "AIzaSyB5dWTgpPEjWo3yBpvyzPqcE4w0Aa7g55A",
// authDomain: "omuthiya-town-council.firebaseapp.com",
// projectId: "omuthiya-town-council",
// storageBucket: "omuthiya-town-council.appspot.com",
// messagingSenderId: "174413294640",
// appId: "1:174413294640:web:b6b6944ecf5e916a75d1f5",
// measurementId: "G-X08DN1CZ48",

// OKAHANDJA
// apiKey: "AIzaSyAaM-9Yp6FCNTQWgoRy2OboPa8a3podPvs",
// authDomain: "okahandja-municipality-pms.firebaseapp.com",
// projectId: "okahandja-municipality-pms",
// storageBucket: "okahandja-municipality-pms.appspot.com",
// messagingSenderId: "35628990074",
// appId: "1:35628990074:web:9933282ffe008a846085c3",
// measurementId: "G-H55XYY4029"

// NKURENKURU
// apiKey: "AIzaSyDasgXX3u3cLujb7rwGlJpqgXV2wwfmKS8",
// authDomain: "nkurenkuru-town-council.firebaseapp.com",
// projectId: "nkurenkuru-town-council",
// storageBucket: "nkurenkuru-town-council.appspot.com",
// messagingSenderId: "651659197779",
// appId: "1:651659197779:web:122730299f6c30bbacf5a6",
// measurementId: "G-N3BJ50MDSN"

// UNICOMMS
// apiKey: "AIzaSyBnqOTasd03TEEeNx-ZPx2cS6QSBr07Ey4",
// authDomain: "unicommspms.firebaseapp.com",
// projectId: "unicommspms",
// storageBucket: "unicommspms.appspot.com",
// messagingSenderId: "1039071543676",
// appId: "1:1039071543676:web:fb4201dc72804005e7e4f9",
// measurementId: "G-0GV26556D0",

//divundu
// apiKey: "AIzaSyDpOogcLVYuEyiR9sTlJSR_px8YRVjhQUk",
// authDomain: "divubdu.firebaseapp.com",
// projectId: "divubdu",
// storageBucket: "divubdu.appspot.com",
// messagingSenderId: "243200800726",
// appId: "1:243200800726:web:99c5f971572f9020325677",
// measurementId: "G-36QVQJ5W8B"


//Jobcard Test
//  apiKey: "AIzaSyCUghyqzwalQojYCJgnovBxM3-YnEgVd2s",
//   authDomain: "nkurenkuru-36978.firebaseapp.com",
//   projectId: "nkurenkuru-36978",
//   storageBucket: "nkurenkuru-36978.appspot.com",
//   messagingSenderId: "378590785803",
//   appId: "1:378590785803:web:ce211399e815b5901af20e"