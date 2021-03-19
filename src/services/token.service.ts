import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) {}

  getToken(channel: string, uid: string) {
    const url = `${API_BASE_URL}/token`;
    return this.http.post<{token: string}>(url, { channel, uid })
      .pipe(map(response => response.token));
  }

}
