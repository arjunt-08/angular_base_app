import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-wrapper" [class.has-error]="!!error" [class.is-disabled]="disabled">
      @if (label) {
        <label [for]="selectId" class="select-label">
          {{ label }}
          @if (required) {
            <span class="required-indicator" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="select-container">
        <select
          [id]="selectId"
          [disabled]="disabled"
          [value]="value"
          (change)="onSelectChange($event)"
          (blur)="onBlur()"
          class="select-field"
          [attr.aria-invalid]="!!error"
        >
          @if (placeholder) {
            <option value="" disabled [selected]="!value">{{ placeholder }}</option>
          }
          @for (option of options; track option.value) {
            <option [value]="option.value" [selected]="option.value === value">
              {{ option.label }}
            </option>
          }
        </select>
        <div class="select-arrow" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      @if (error) {
        <p class="select-error" role="alert">{{ error }}</p>
      } @else if (hint) {
        <p class="select-hint">{{ hint }}</p>
      }
    </div>
  `,
  styles: [
    `
      .select-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        width: 100%;
      }

      .select-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
      }

      .required-indicator {
        color: var(--color-danger);
        margin-left: 0.25rem;
      }

      .select-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .select-field {
        width: 100%;
        height: 2.5rem;
        padding: 0 2rem 0 0.75rem;
        font-size: 0.875rem;
        color: var(--color-text-primary);
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-base);
        border-radius: 0.5rem;
        outline: none;
        cursor: pointer;
        appearance: none;
        transition:
          border-color 150ms ease,
          box-shadow 150ms ease;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: var(--focus-ring);
        }

        &:disabled {
          background-color: var(--color-bg-muted);
          cursor: not-allowed;
        }
      }

      .select-arrow {
        position: absolute;
        right: 0.75rem;
        pointer-events: none;
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
      }

      .has-error .select-field {
        border-color: var(--color-danger);

        &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
        }
      }

      .select-error {
        font-size: 0.75rem;
        color: var(--color-danger);
        margin: 0;
      }

      .select-hint {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin: 0;
      }
    `,
  ],
})
export class SelectComponent implements ControlValueAccessor {
  private static nextId = 0;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() options: SelectOption[] = [];
  @Input() error: string | null = null;
  @Input() hint = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() selectId = `app-select-${++SelectComponent.nextId}`;

  value: string | number = '';

  onChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: unknown): void {
    this.value = val !== null && val !== undefined ? (val as string | number) : '';
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
