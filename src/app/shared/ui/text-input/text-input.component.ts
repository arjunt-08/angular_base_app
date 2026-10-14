import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="!!error" [class.is-disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="input-label">
          {{ label }}
          @if (required) {
            <span class="required-indicator" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="input-container">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="input-field"
          [attr.aria-invalid]="!!error"
          [attr.aria-describedby]="error ? inputId + '-error' : hint ? inputId + '-hint' : null"
        />
      </div>

      @if (error) {
        <p [id]="inputId + '-error'" class="input-error" role="alert">{{ error }}</p>
      } @else if (hint) {
        <p [id]="inputId + '-hint'" class="input-hint">{{ hint }}</p>
      }
    </div>
  `,
  styles: [
    `
      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        width: 100%;
      }

      .input-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      .required-indicator {
        color: var(--color-danger);
        margin-left: 0.25rem;
      }

      .input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-field {
        width: 100%;
        height: 2.5rem;
        padding: 0 0.75rem;
        font-size: 0.875rem;
        color: var(--color-text-primary);
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-base);
        border-radius: 0.5rem;
        outline: none;
        transition:
          border-color 150ms ease,
          box-shadow 150ms ease;

        &::placeholder {
          color: var(--color-text-muted);
        }

        &:focus {
          border-color: var(--color-primary);
          box-shadow: var(--focus-ring);
        }

        &:disabled {
          background-color: var(--color-bg-muted);
          cursor: not-allowed;
        }
      }

      .has-error .input-field {
        border-color: var(--color-danger);

        &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
        }
      }

      .input-error {
        font-size: 0.75rem;
        color: var(--color-danger);
        margin: 0;
      }

      .input-hint {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin: 0;
      }
    `,
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  private static nextId = 0;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() error: string | null = null;
  @Input() hint = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() inputId = `app-text-input-${++TextInputComponent.nextId}`;

  value = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: unknown): void {
    this.value = val !== null && val !== undefined ? String(val) : '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
