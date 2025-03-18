import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

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

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/user-profile`);
  }

  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admins/admin-profile`);
  }

  /**
   * Gọi API BE để lưu token vào Redis.
   * FE sẽ gửi đối tượng LoginResponse sau khi đăng nhập thành công từ Keycloak.
   */
  saveToken(loginResponse: LoginResponse) {
    return this.http.post(
      'http://localhost:8888/api/v1/auth/save-token',
      loginResponse,
      { responseType: 'text' } // Cấu hình nhận response dạng text
    );
  }
  
}
