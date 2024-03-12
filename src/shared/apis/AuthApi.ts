import AppStore from "../stores/AppStore";

import { defaultUser, IUser } from "../models/User";
import AppApi from "./AppApi";
import {
  signInWithPopup,
  OAuthProvider,
  signOut,
  signInWithRedirect,
  UserCredential,
  onAuthStateChanged,
  User as FirebaseUser,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, getDoc } from "firebase/firestore";

// tenant: "fa3d3433-ec90-43bd-b8c9-a5f517b44e05", unknown
// tenant: "1b6be874-fce1-4662-9955-6f8e64efbc5a", // lots

const GRAPH_API_ENDPOINTS = {
  ME: "https://graph.microsoft.com/beta/me", // get profile data https://graph.microsoft.com/beta/$metadata
};

export default class AuthApi {
  private provider = new OAuthProvider("microsoft.com");

  constructor(private api: AppApi, private store: AppStore) {
    this.provider.setCustomParameters({
      // Force re-consent.
      // prompt: "consent",
      // Target specific email with login hint.
      login_hint: "user@namcor.com.na",
      tenant: "a4abb518-84c8-4637-a306-ecd78b9e8bbd", //namcor
      // tenant: "1b6be874-fce1-4662-9955-6f8e64efbc5a", // lots
    });

    this.provider.addScope("mail.read");
    this.provider.addScope("calendars.read");
    this.handleAuthStateChange();
  }

  // private handleAuthStateChange() {
  //   onAuthStateChanged(auth, async (user) => {
  //     this.store.auth.setLoading(true); // start loading.
  //     if (!user) {
  //       this.logOut();
  //       this.store.auth.setLoading(false); // start loading.
  //       return;
  //     }

  //     try {
  //       this.handleUserBasicInfo(user);
  //       // this.handleUserCredential(cred); // Get user info from graph api.
  //     } catch (error) {
  //       // console.log("Error: ", error);
  //       this.logOut();
  //     }
  //   });
  // }

  private handleAuthStateChange() {
    onAuthStateChanged(auth, async (user) => {
      this.store.auth.setLoading(true); // start loading.
      if (!user) {
        this.logOut();
        this.store.auth.setLoading(false); // start loading.
        return;
      }

      try {
        this.onSignedIn(user);
      } catch (error) {
        this.store.auth.setLoading(false);
        this.logOut();
      }
    });
  }

  private async onSignedIn(user: FirebaseUser) {
    this.store.auth.setLoading(true);
    const $doc = await getDoc(doc(db, "users", user.uid));

    if (!$doc.exists()) {
      this.store.auth.setLoading(false);
      return;
    }
    const $user = { uid: $doc.id, ...$doc.data() } as IUser;
    this.store.auth.logIn($user);
    this.store.auth.setLoading(false);
  }

  

  async signIn(email: string, password: string) {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        return null;
      });

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      return null;
    });

    if (userCredential) return userCredential.user;
    return userCredential;
  }

  async passwordResetWithEmail(email: string) {
    await sendPasswordResetEmail(auth, email)
      .then(function () {
        alert("Password reset email sent.");
      })
      .catch(function (error) {
        alert("Could not send email.");
      });
  }

  async passwordResetWithOldPassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const credential = EmailAuthProvider.credential(email, oldPassword);
    const user = auth.currentUser;
    if (!user) return;
    await reauthenticateWithCredential(user, credential)
      .then(() => {
        if (newPassword.length >= 6)
          // User re-authenticated.
          updatePassword(user, newPassword)
            .then(function () {
              // Update successful.
              alert("Password reset successfully");
            })
            .catch(function (error) {
              // An error happened.
              alert("Could not reset password");
            });
        else alert("Password should be atleast 6 characters long");
      })
      .catch((error) => {
        // An error happened.
        alert("Incorrect password");
      });
  }

  async logInWithPopup() {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const cred = await signInWithPopup(auth, this.provider);
      await this.handleUserCredential(cred);
    } catch (error) {
      // Handle error.
      // console.log("Error: ", error); pop-up closed error
    }
  }

  async logInWithRedirect() {
    await setPersistence(auth, browserSessionPersistence);
    signInWithRedirect(auth, this.provider);
  }

  private async handleUserCredential(result: UserCredential) {
    // User is signed in.
    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    if (!credential) {
      this.logOut(); // no user credentials, logOut user.
      return;
    }

    // accessToken & idToken
    const { accessToken = "" } = credential;

    // handle authenticated user
    const user = result.user;

    // get user info
    const userInfo = await this.getUserInfo(accessToken);
    const additionalUserInfo = {
      email: userInfo.mail || userInfo.userPrincipalName,
      jobTitle: userInfo.jobTitle || "",
    };

    // handle user basic info
    await this.handleUserBasicInfo(user, additionalUserInfo);
  }

  private async handleUserBasicInfo(
    user: FirebaseUser,
    additionalUserInfo: any = {}
  ) {
    // get doc
    try {
      const $doc = await getDoc(doc(db, "users", user.uid));

      // update db if user is not exist || has not logged in before.
      if (!$doc.exists()) {
        // user basic info
        const me: IUser = {
          ...defaultUser,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          createdAt: user.metadata.creationTime || null,
          lastLoginAt: user.metadata.lastSignInTime || null,
          ...additionalUserInfo,
        };
        try {
          this.api.user.create(me); // TODO: optimize
          this.store.auth.logIn(me); // update current user store
        } catch (error) {
          console.log(error);
        }
      } else {
        // user basic info
        const me: IUser = {
          ...defaultUser,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          createdAt: user.metadata.creationTime || null,
          lastLoginAt: user.metadata.lastSignInTime || null,
          ...$doc.data(),
          ...additionalUserInfo,
        };
        this.api.user.create(me); // TODO: optimize
        this.store.auth.logIn(me); // update current user store
      }

      this.store.auth.setLoading(false); // start loading.
    } catch (error) {
      // throw new Error("Failed to sign-in");
      // console.log(error); //firebase
    }
  }

  private async getUserInfo(accessToken: string) {
    try {
      const userInfo = await this.callGraphApi(
        GRAPH_API_ENDPOINTS.ME,
        accessToken
      );
      return userInfo;
    } catch (error) {
      // console.log(error);
    }
  }

  private async callGraphApi(endpoint: string, token: string) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append("Authorization", bearer);
    const options = {
      method: "GET",
      headers: headers,
    };

    const response = await fetch(endpoint, options);
    const userInfo = await response.json();

    try {
      return userInfo;
    } catch (error) {
      // console.error(error);
    }
  }

  //sign in with email and password firebase
  // async signIn(email: string, password: string) {
  //   setPersistence(auth, browserLocalPersistence).then(() => {
  //     return signInWithEmailAndPassword(auth, email, password);
  //   }).catch((error) => {
  //     return null;
  //   });

  //   const userCredential = await signInWithEmailAndPassword(
  //     auth,
  //     email,
  //     password
  //   ).catch((error) => {
  //     return null;
  //   });

  //   if (userCredential) return userCredential.user;
  //   return userCredential;
  // }

  // async passwordResetWithEmail(email: string) {
  //   await sendPasswordResetEmail(auth, email).then(function () {
  //     alert("Password reset email sent.");
  //   }).catch(function (error) {
  //     alert("Could not send email.");
  //   });
  // }

  // logout
  async logOut() {
    try {
      await signOut(auth);
    } catch (error) {
      // console.log("Error, sign-out failed.");
    }

    // Remove user from store.
    this.store.auth.logOut();
  }
}
