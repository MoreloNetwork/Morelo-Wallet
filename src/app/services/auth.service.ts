import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Response } from '../models/response';
import { User } from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type':'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api = 'http://localhost:100/api/auth';

  constructor(private http: HttpClient) { }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn() {
    if(this.getToken()){
      return true;
    }
    else{
      return false;
    }
    //return this.getToken() != '' ? true : false;
  }

  // api error handler
  errorHandler<T>(action: string, result?: T) {
    return (error: any): Observable<T> => {
      //console.error(action, error);
      return of(result as T);
    };
  }

  // login function - get jwt token from backend
  login(user: User): Observable<string> {
    return this.http.post<Response>(this.api + '/login', { user }, httpOptions).pipe(
      map(res => {
        const status = res.status;
        if(status == 'ok'){
          this.setToken(res.data);
        }
        return status;
      }),
      catchError(this.errorHandler('login'))
    );
  }

  // register function - sent user object to backend and expect status
  register(user: User): Observable<any> {
    return this.http.post<any>(this.api + '/register', JSON.stringify(user)).pipe(
      map(res => {
        const status = res.status;
        if(status == 'ok'){
          this.setToken(res.data.jwt);
        }
        return res;
      }),
      catchError(this.errorHandler('register'))
    );
  }

  checkLogin(user: User): Observable<any> {
    return this.http.post<any>(this.api + '/checkLogin', JSON.stringify(user)).pipe(
      map(res => {
        return res;
      }),
      catchError(this.errorHandler('register'))
    );
  }


}
