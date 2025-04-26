import { Component, DEFAULT_CURRENCY_CODE, OnInit } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-age-calculator',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './age-calculator.component.html',
  styleUrl: './age-calculator.component.scss',
})
export default class AgeCalculatorComponent implements OnInit {
  isLoading = false;
  ageDetails: { years: number; months: number; days: number } | null = null;
  ageForm!: FormGroup;

  ngOnInit(): void {
    this.ageForm = new FormGroup({
      dateOfBirth: new FormControl('', Validators.required),
      todaysDate: new FormControl(
        new Date().toISOString().split('T')[0],
        Validators.required
      ), // Default to today's date
    });
  }

  reset() {
    this.ageDetails = null;
    this.ageForm.reset();
    this.isLoading = false;
    if (
      this.ageForm.controls['todaysDate'].value !==
      new Date().toISOString().split('T')[0]
    ) {
      this.ageForm.controls['todaysDate'].setValue(
        new Date().toISOString().split('T')[0]
      );
    }
  }

  calculateAge() {
    this.isLoading = true;
    if (this.ageForm.valid) {
      const dob = new Date(this.ageForm.value.dateOfBirth);
      const today = new Date(this.ageForm.value.todaysDate);

      this.calculatePreciseAge(dob, today).then((result) => {
        this.ageDetails = result;
      });
    }
  }

  // Function to calculate years, months, and days
  private async calculatePreciseAge(
    dob: Date,
    today: Date
  ): Promise<{ years: number; months: number; days: number }> {
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    // Adjust if the current month or day is earlier than the birth month/day
    if (days < 0) {
      // Borrow days from the previous month
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of the previous month
      days += previousMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    // sleep for 1 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.isLoading = false;
    return { years, months, days };
  }
}
