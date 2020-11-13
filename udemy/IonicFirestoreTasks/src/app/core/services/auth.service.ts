import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase/app';
import 'firebase/app';
import { AuthOptions, AuthProvider, User } from './auth.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth
    ) {
      this.authState$ = this.afAuth.authState;
    }
  
  get isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(user => user !== null));
  }

  authenticate({ isSignIn, provider, user }: AuthOptions): Promise<firebase.auth.UserCredential> {
    let operation: Promise<firebase.auth.UserCredential>;

    if(provider !== AuthProvider.Email){
        operation = this.signInWithPopup(provider);
    }else{
      operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
    }

    return operation;
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  //se isSignIn === true significa que ja tem uma conta, caso contrario cria uma
  private signInWithEmail({ email, password}: User): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  private signUpWithEmail({email, password, name}: User): Promise<firebase.auth.UserCredential> {
    return firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(credentials =>
        credentials.user
          .updateProfile({ displayName: name, photoURL: null })
          .then(() => credentials)
      )
  }

  private signInWithPopup(provider: AuthProvider): Promise<firebase.auth.UserCredential> {
    let signInProvider = null;

    switch (provider) {
      case AuthProvider.Facebook:
        signInProvider = new firebase.auth.FacebookAuthProvider();
        break;
    }

    return this.afAuth.signInWithPopup(signInProvider);
  }
}
