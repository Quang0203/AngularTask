import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// Interface cho payload token (điều chỉnh theo cấu trúc token của bạn)
export interface TokenPayload {
  sub: string;
  // Các trường khác nếu cần...
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private keycloak: KeycloakService) { }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-user`, user);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh-token`, { refreshToken });
  }

  private async getUserIdFromToken(): Promise<string | null> {
    const loggedIn = await this.keycloak.isLoggedIn();
    if (!loggedIn) {
      console.error('User not logged in.');
      return null;
    }
    // Nếu cần, load profile trước (tùy thuộc vào việc Keycloak đã load profile hay chưa)
    try {
      await this.keycloak.loadUserProfile();
    } catch (err) {
      console.error('Error loading user profile', err);
      return null;
    }
    const token = await this.keycloak.getToken();
    const payload: TokenPayload = jwtDecode(token);
    console.log('Token payload:', payload);
    // Lấy id từ trường "sub"
    if (payload && payload.sub) {
      return payload.sub;
    } else {
      console.error('No id found in token payload.');
      return null;
    }
  }
  

  // Sử dụng RxJS để chuyển Promise sang Observable và truyền id qua query parameter
  getUserProfile(): Observable<any> {
    return from(this.getUserIdFromToken()).pipe(
      mergeMap(userId => {
        console.log('User ID:', userId);
        if (!userId) {
          return throwError(() => new Error('User not logged in or user id not found in token.'));
        }
        // Truyền id thông qua query parameter
        return this.http.get(`${this.baseUrl}/users/user-profile`, { params: { id: userId } });
      })
    );
  }

  getAdminProfile(): Observable<any> {
    return from(this.getUserIdFromToken()).pipe(
      mergeMap(adminId => {
        if (!adminId) {
          return throwError(() => new Error('User not logged in or admin id not found in token.'));
        }
        return this.http.get(`${this.baseUrl}/admins/admin-profile`, { params: { id: adminId } });
      })
    );
  }

  /**
   * Gọi API BE để lưu token vào Redis.
   * FE sẽ gửi đối tượng LoginResponse sau khi đăng nhập thành công từ Keycloak.
   */
  saveToken(loginResponse: LoginResponse) {
    return this.http.post(
      'http://localhost:8888/api/v1/auth/save-token',
      loginResponse,
      { responseType: 'text' }
    );
  }
}
