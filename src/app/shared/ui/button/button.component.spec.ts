import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create button component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply primary variant class by default', () => {
    const buttonEl = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(buttonEl.classList.contains('btn-primary')).toBe(true);
  });

  it('should apply danger variant class when specified', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const buttonEl = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(buttonEl.classList.contains('btn-danger')).toBe(true);
  });

  it('should emit btnClick event when clicked while enabled', () => {
    const clickSpy = vi.fn();
    component.btnClick.subscribe(clickSpy);

    const buttonEl = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    buttonEl.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit btnClick event when disabled', () => {
    const clickSpy = vi.fn();
    component.btnClick.subscribe(clickSpy);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    buttonEl.click();

    expect(clickSpy).not.toHaveBeenCalled();
    expect(buttonEl.disabled).toBe(true);
  });

  it('should show spinner and be disabled when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const spinnerEl = buttonEl.querySelector('.spinner');

    expect(spinnerEl).toBeTruthy();
    expect(buttonEl.disabled).toBe(true);
  });
});
