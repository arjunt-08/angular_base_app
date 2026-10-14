import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorMessage) {
      <p class="form-error-text" role="alert">
        {{ errorMessage }}
      </p>
    }
  `,
  styles: [
    `
      .form-error-text {
        font-size: 0.75rem;
        color: var(--color-danger);
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() customMessage: string | null = null;
  @Input() fieldName = 'Field';

  get errorMessage(): string | null {
    if (this.customMessage) {
      return this.customMessage;
    }

    if (!this.control || !this.control.errors || (!this.control.touched && !this.control.dirty)) {
      return null;
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return `${this.fieldName} is required`;
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      return `${this.fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${this.fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['whitespace']) {
      return `${this.fieldName} cannot be empty whitespace`;
    }
    if (errors['positiveNumber']) {
      return `${this.fieldName} must be a positive number`;
    }
    if (errors['invalidUrl']) {
      return 'Please enter a valid URL';
    }

    // First custom error message
    const firstKey = Object.keys(errors)[0];
    if (typeof errors[firstKey] === 'string') {
      return errors[firstKey];
    }

    return `${this.fieldName} is invalid`;
  }
}
