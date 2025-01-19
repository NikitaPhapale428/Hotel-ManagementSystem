// contact-us.component.ts
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    message: '',
  };

  sendthemail = false;
  isSubmitting = false;
  smessage = '';
  errorMessage = '';

  public async sendEmail(form: NgForm) {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.sendthemail = false;
    this.errorMessage = '';

    try {
      const response = await emailjs.send(
        'service_yes7kow',
        'template_djofpon',
        {
          first_name: this.formData.first_name,
          last_name: this.formData.last_name,
          email: this.formData.email,
          mobile_number: this.formData.mobile_number,
          message: this.formData.message,
        },
        'zb1jOwuICw2_QN2VE'
      );

      this.sendthemail = true;
      this.smessage = 'Email sent successfully! We will get back to you soon.';
      this.resetForm(form);
    } catch (error) {
      this.sendthemail = false;
      this.errorMessage = 'Failed to send email. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.formData = {
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      message: '',
    };
  }

  closeAlert() {
    this.sendthemail = false;
    this.errorMessage = '';
  }
}
