// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { User } from 'src/app/class/user';
import { HotelBookingSystemService } from 'src/app/service/hotel-booking-system.service';
import { ToastService } from 'src/app/service/toast.service';
import { compileNgModule } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  un: string = '';
  pwd: string = '';
  users: User[] = [];
  count: number = 0;
  user: any;
  loggedIn: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: Router,
    private hotelService: HotelBookingSystemService,
    private toast: ToastService,
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.loggedIn = true;
          this.route.navigateByUrl('user');
        }
      },
      error: (error) => {
        this.errorMessage = 'Social login failed. Please try again.';
        console.error('Social auth error:', error);
      },
    });
  }

  login(loginForm: any) {
    this.isLoading = true;
    this.errorMessage = '';
    this.count = 0;

    this.hotelService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        let userFound = false;

        this.users.forEach((user) => {
          console.log(user.userName);
          console.log(this.decryptPassword(user.userPassword));
          if (
            loginForm.un === user.userName &&
            loginForm.pwd === this.decryptPassword(user.userPassword)
          ) {
            userFound = true;
            this.count = 1;
            this.handleSuccessfulLogin(user);
          }
        });
        console.log(data);
        if (!userFound) {
          this.handleFailedLogin();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Login failed. Please check your network connection and try again.';
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private handleSuccessfulLogin(user: User) {
    // Store user data in localStorage
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('userName', user.userName);
    localStorage.setItem('userPhno', user.userPhno);
    localStorage.setItem('userAddress', user.userAddress);
    localStorage.setItem('userEmail', user.userEmail);
    localStorage.setItem('userType', user.userType);

    // Navigate based on user role
    if (user.userType === 'ADMIN') {
      this.route.navigateByUrl('admin');
    } else {
      this.route.navigateByUrl('user');
    }
  }

  private handleFailedLogin() {
    this.errorMessage = 'Invalid username or password';
    // this.toast.userLogin();
  }

  decryptPassword(encryptedString: string): string {
    if (!encryptedString) return '';

    try {
      return atob(atob(encryptedString.split('').reverse().join('')));
    } catch (error) {
      console.error('Decryption error:', error);
      this.errorMessage = 'Error processing login credentials';
      return '';
    }
  }
}
