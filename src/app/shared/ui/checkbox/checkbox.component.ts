import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label class="checkbox-wrapper" [class.is-disabled]="disabled">
      <input
        type="checkbox"
        [id]="checkboxId"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onCheckboxChange($event)"
        (blur)="onBlur()"
        class="checkbox-input visually-hidden"
      />
      <span class="checkbox-box" [class.checked]="checked" aria-hidden="true">
        @if (checked) {
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        }
      </span>
      @if (label) {
        <span class="checkbox-label">{{ label }}</span>
      }
    </label>
  `,
  styles: [
    `
      .checkbox-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        user-select: none;
        font-size: 0.875rem;
        color: var(--color-text-primary);

        &.is-disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      }

      .checkbox-box {
        width: 1.125rem;
        height: 1.125rem;
        border: 1px solid var(--color-border-base);
        border-radius: 0.25rem;
        background-color: var(--color-bg-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary-contrast);
        transition: all 150ms ease;

        &.checked {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
        }
      }

      .checkbox-input:focus-visible + .checkbox-box {
        box-shadow: var(--focus-ring);
      }
    `,
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  private static nextId = 0;

  @Input() label = '';
  @Input() disabled = false;
  @Input() checkboxId = `app-checkbox-${++CheckboxComponent.nextId}`;

  checked = false;

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: boolean): void {
    this.checked = !!val;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onCheckboxChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.onChange(this.checked);
  }

  onBlur(): void {
    this.onTouched();
  }
}
