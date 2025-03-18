import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile: any;
  message: string = ''; 
  error: string = ''; 

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
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