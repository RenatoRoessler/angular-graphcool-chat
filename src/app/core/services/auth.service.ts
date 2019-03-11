import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';
import { StorageKeys } from '../../storage-keys';
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser: User;
  redirectUrl: string;
  manterLogado: boolean;
  // tslint:disable-next-line:variable-name
  private _isAuthenticated = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {
      this.isAuthenticated.subscribe(is => console.log('AuthoState', is));
      this.init();
  }

  init(): void {
    this.manterLogado = JSON.parse(window.localStorage.getItem(StorageKeys.MANTER_LOGADO));
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  loginUser(variables: {email: string, password: string}): Observable<{id: string, token: string}> {
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data.authenticateUser),
      tap(res => this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res !== null })),
      catchError(error => {
        this.setAuthState({id: null, token: null , isAuthenticated: false });
        return throwError(error);
      })
    );
  }

  cadastrarUser(variables: {name: string, email: string, password: string}): Observable<{id: string, token: string}> {
    return this.apollo.mutate({
      mutation: SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data.signupUser),
      tap(res => this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res !== null })),
      catchError(error => {
        this.setAuthState({id: null, token: null , isAuthenticated: false });
        return throwError(error);
      })
    );
  }

  toggleManterLogado(): void {
    this.manterLogado = !this.manterLogado;
    window.localStorage.setItem(StorageKeys.MANTER_LOGADO, this.manterLogado.toString());
  }

  logout(): void {
    window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
    window.localStorage.removeItem(StorageKeys.MANTER_LOGADO);
    this.manterLogado = false;
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
    this.apollo.getClient().resetStore();
  }

  autoLogin(): Observable<void> {
    if (!this.manterLogado) {
      this._isAuthenticated.next(false);
      window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
      return of();
    }
    /*
    return this.validateToken()
      .pipe(
        tap(authData => {
          const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
          this.setAuthState({id: authData.id, token, isAuthenticated: authData.isAuthenticated});
        }),
        mergeMap(res => of()),
        catchError(error => {
          this.setAuthState({id: null, token: null, isAuthenticated: false});
          return throwError(error);
        })
      );
    */
    // return por que o código acima está com bug
    return of();
  }

  private validateToken(): Observable<{id: string, isAuthenticated: boolean}> {
    return this.apollo.query<LoggedInUserQuery>({
      query: LOGGED_IN_USER_QUERY
    }).pipe(
      map(res => {
        const user = res.data.loggedInUser;
        return {
          id: user && user.id,
          isAuthenticated: user !== null
        };
      })
    );
  }

  private setAuthState(authData: { id: string, token: string, isAuthenticated: boolean} ): void {
    if (authData.isAuthenticated) {
      window.localStorage.setItem( StorageKeys.AUTH_TOKEN, authData.token );
      this.authUser = { id: authData.id };
    }
    this._isAuthenticated.next(authData.isAuthenticated);
  }
}
