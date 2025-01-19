import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/class/user';
import { HotelBookingSystemService } from 'src/app/service/hotel-booking-system.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  id: number = 0; // Initialize with 0 or another default value
  user: User = new User();
  isLoading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private hotelService: HotelBookingSystemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;
    // Convert string ID to number using parseInt or Number()
    const idParam = this.route.snapshot.params['id'];
    this.id = Number(idParam);

    if (!this.id) {
      this.handleError('User ID not found');
      return;
    }

    this.hotelService.getUserByID(this.id).subscribe({
      next: (data) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Error loading user data');
        console.error('Error fetching user:', error);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.hotelService.updateUser(this.id, this.user).subscribe({
      next: (response) => {
        this.successMessage = 'User updated successfully';
        this.navigateBack();
      },
      error: (error) => {
        this.handleError('Error updating user');
        console.error('Update error:', error);
        this.isLoading = false;
      },
    });
  }

  private validateForm(): boolean {
    if (!this.user.userName?.trim()) {
      this.handleError('Name is required');
      return false;
    }

    if (!this.user.userEmail?.trim()) {
      this.handleError('Email is required');
      return false;
    }

    if (!this.validateEmail(this.user.userEmail)) {
      this.handleError('Invalid email format');
      return false;
    }

    if (!this.user.userPhno?.trim()) {
      this.handleError('Contact number is required');
      return false;
    }

    return true;
  }

  private validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      if (this.errorMessage === message) {
        this.errorMessage = '';
      }
    }, 5000);
  }

  private navigateBack(): void {
    setTimeout(() => {
      this.router
        .navigate(['/user-crud'])
        .catch((error) => console.error('Navigation error:', error));
    }, 1000);
  }

  isSubmitDisabled(): boolean {
    return (
      this.isLoading ||
      !this.user.userName?.trim() ||
      !this.user.userEmail?.trim() ||
      !this.user.userPhno?.trim()
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
