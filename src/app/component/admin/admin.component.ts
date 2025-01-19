import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  userName: string | null = localStorage.getItem('userName');
  isMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.userName) {
      this.router.navigate(['/login']);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigate(): void {
    this.router.navigate(['user-crud']);
  }

  navigateToHotel(): void {
    this.router.navigate(['hotel-crud']);
  }

  navigateToLocation(): void {
    this.router.navigate(['location-crud']);
  }

  navigateToBooking(): void {
    this.router.navigate(['booking-crud']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
