// src/app/components/admin-profile/admin-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html'
})
export class AdminProfileComponent implements OnInit {
  profile: any;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAdminProfile().subscribe(
      data => { this.profile = data; },
      err => { this.error = 'Failed to load admin profile.'; }
    );
  }
}
