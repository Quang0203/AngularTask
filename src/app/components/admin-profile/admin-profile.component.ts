import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profile: any;
  message: string = ''; 
  error: string = ''; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAdminProfile().subscribe({
      next: (response: any) => { 
        if (response?.message) {
          this.message = response.message; // Lấy message từ API
        }
        if (response?.data) {
          this.profile = response.data; // Nếu có data thì lấy
        }
      },
      error: (err: any) => { 
        this.error = 'Failed to load user profile.'; 
        this.message = err.message || 'An unknown error occurred';
      }
    });
  }
}  