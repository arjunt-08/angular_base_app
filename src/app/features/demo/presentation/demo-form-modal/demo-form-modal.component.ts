import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { SelectComponent, SelectOption } from '@shared/ui/select/select.component';
import { FormErrorComponent } from '@shared/ui/form-error/form-error.component';
import { CustomValidators } from '@shared/validators/custom-validators';
import {
  CreateProjectPayload,
  ProjectPriority,
  ProjectStatus,
} from '../../domain/models/project.model';

@Component({
  selector: 'app-demo-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonComponent,
    TextInputComponent,
    SelectComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Create New Enterprise Project"
      size="md"
      (close)="onClose()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="project-form">
        <div class="form-row">
          <app-text-input
            formControlName="name"
            label="Project Name"
            placeholder="e.g. Real-Time Telemetry Pipeline"
            [required]="true"
            [error]="getFieldError('name')"
          ></app-text-input>
        </div>

        <div class="form-grid">
          <app-text-input
            formControlName="code"
            label="Project Code"
            placeholder="e.g. TEL-101"
            [required]="true"
            [error]="getFieldError('code')"
          ></app-text-input>

          <app-text-input
            formControlName="leadName"
            label="Lead Engineer / PM"
            placeholder="e.g. Elena Rostova"
            [required]="true"
            [error]="getFieldError('leadName')"
          ></app-text-input>
        </div>

        <div class="form-grid">
          <app-select
            formControlName="status"
            label="Initial Status"
            [options]="statusOptions"
            [required]="true"
            [error]="getFieldError('status')"
          ></app-select>

          <app-select
            formControlName="priority"
            label="Priority Level"
            [options]="priorityOptions"
            [required]="true"
            [error]="getFieldError('priority')"
          ></app-select>
        </div>

        <div class="form-row">
          <app-text-input
            formControlName="budget"
            type="number"
            label="Allocated Budget (USD)"
            placeholder="e.g. 250000"
            [required]="true"
            [error]="getFieldError('budget')"
          ></app-text-input>
        </div>

        <div class="form-row">
          <app-text-input
            formControlName="description"
            label="Strategic Description"
            placeholder="Brief scope, architecture impact, and objectives"
            [required]="true"
            [error]="getFieldError('description')"
          ></app-text-input>
        </div>

        <div modal-footer>
          <app-button variant="ghost" type="button" (btnClick)="onClose()">Cancel</app-button>
          <app-button variant="primary" type="submit" [disabled]="form.invalid"
            >Create Project</app-button
          >
        </div>
      </form>
    </app-modal>
  `,
  styles: [
    `
      .project-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .form-row {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class DemoFormModalComponent {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<CreateProjectPayload>();

  readonly statusOptions: SelectOption[] = [
    { label: 'Planning', value: 'planning' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' },
  ];

  readonly priorityOptions: SelectOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, CustomValidators.noWhitespace(), Validators.minLength(3)]],
    code: ['', [Validators.required, CustomValidators.noWhitespace(), Validators.minLength(2)]],
    leadName: ['', [Validators.required, CustomValidators.noWhitespace()]],
    status: ['planning', [Validators.required]],
    priority: ['medium', [Validators.required]],
    budget: [100000, [Validators.required, CustomValidators.positiveNumber()]],
    description: [
      '',
      [Validators.required, CustomValidators.noWhitespace(), Validators.minLength(10)],
    ],
  });

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (!control || !control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['whitespace']) return 'Cannot be only whitespace.';
    if (control.errors['minlength'])
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['positiveNumber']) return 'Must be a positive number greater than 0.';
    return 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const payload: CreateProjectPayload = {
      name: val.name,
      code: val.code,
      leadName: val.leadName,
      status: val.status as ProjectStatus,
      priority: val.priority as ProjectPriority,
      budget: Number(val.budget),
      description: val.description,
    };

    this.formSubmit.emit(payload);
    this.form.reset({
      status: 'planning',
      priority: 'medium',
      budget: 100000,
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
