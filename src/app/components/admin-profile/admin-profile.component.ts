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
        // response có cấu trúc: { code, message, timestamp, data }
        this.message = response.message;
        this.profile = response.data;
      },
      error: (err: any) => { 
        console.log('Error loading admin profile', err);
        this.error = 'Failed to load admin profile.'; 
        this.message = err.message || 'An unknown error occurred';
      }
    });
  }
}
