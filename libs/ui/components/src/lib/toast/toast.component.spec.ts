import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ToastComponent, ToastData, ToastConfig } from './toast.component';

@Component({
	template: `
		<ui-toast 
			[data]="toastData" 
			[config]="toastConfig"
			(onDismiss)="onDismissed()">
		</ui-toast>
	`
})
class TestHostComponent {
	toastData: ToastData = { message: 'Test message' };
	toastConfig: ToastConfig = {};
	onDismissed = jest.fn();
}

describe('ToastComponent', () => {
	let component: ToastComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ToastComponent],
			declarations: [TestHostComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		hostComponent = fixture.componentInstance;
		component = fixture.debugElement.children[0].componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display the message', () => {
		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('Test message');
	});

	it('should display title when provided', () => {
		hostComponent.toastData = { title: 'Test Title', message: 'Test message' };
		fixture.detectChanges();

		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('Test Title');
		expect(compiled.textContent).toContain('Test message');
	});

	it('should apply success variant classes', () => {
		hostComponent.toastConfig = { variant: 'success' };
		fixture.detectChanges();

		const toastElement = fixture.nativeElement.querySelector('[role="alert"]');
		expect(toastElement.className).toContain('bg-green-50');
		expect(toastElement.className).toContain('text-green-800');
	});

	it('should apply error variant classes', () => {
		hostComponent.toastConfig = { variant: 'error' };
		fixture.detectChanges();

		const toastElement = fixture.nativeElement.querySelector('[role="alert"]');
		expect(toastElement.className).toContain('bg-red-50');
		expect(toastElement.className).toContain('text-red-800');
	});

	it('should show close button when dismissible', () => {
		hostComponent.toastConfig = { dismissible: true };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		expect(closeButton).toBeTruthy();
		expect(closeButton.getAttribute('aria-label')).toBe('Dismiss notification');
	});

	it('should hide close button when dismissible is false', () => {
		hostComponent.toastConfig = { dismissible: false };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		expect(closeButton).toBeFalsy();
	});

	it('should emit onDismiss when close button is clicked', () => {
		hostComponent.toastConfig = { dismissible: true };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		closeButton.click();

		expect(hostComponent.onDismissed).toHaveBeenCalled();
	});

	it('should show icon when showIcon is not false', () => {
		hostComponent.toastConfig = { showIcon: true, variant: 'success' };
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('svg');
		expect(icon).toBeTruthy();
	});

	it('should hide icon when showIcon is false', () => {
		hostComponent.toastConfig = { showIcon: false };
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('svg');
		expect(icon).toBeFalsy();
	});

	it('should become visible after initialization', () => {
		jest.useFakeTimers();
		
		// Create a new component to test initialization
		const newFixture = TestBed.createComponent(TestHostComponent);
		const newComponent = newFixture.debugElement.children[0].componentInstance;
		
		expect(newComponent.isVisible()).toBe(false);
		
		newFixture.detectChanges();
		jest.advanceTimersByTime(100);
		
		expect(newComponent.isVisible()).toBe(true);
		
		jest.useRealTimers();
	});

	it('should auto dismiss after duration', () => {
		jest.useFakeTimers();
		
		hostComponent.toastConfig = { duration: 3000 };
		const newFixture = TestBed.createComponent(TestHostComponent);
		const newHostComponent = newFixture.componentInstance;
		newHostComponent.toastData = hostComponent.toastData;
		newHostComponent.toastConfig = hostComponent.toastConfig;
		newHostComponent.onDismissed = jest.fn();
		
		newFixture.detectChanges();
		
		jest.advanceTimersByTime(3000);
		jest.advanceTimersByTime(300); // Wait for dismiss animation
		
		expect(newHostComponent.onDismissed).toHaveBeenCalled();
		
		jest.useRealTimers();
	});

	it('should apply correct transform for right position', () => {
		hostComponent.toastConfig = { position: 'top-right' };
		fixture.detectChanges();

		const toastElement = fixture.nativeElement.querySelector('[role="alert"]');
		expect(toastElement).toBeTruthy();
		const transform = component.getHideTransform();
		expect(transform).toBe('translateX(100%)');
	});

	it('should apply correct transform for left position', () => {
		hostComponent.toastConfig = { position: 'top-left' };
		fixture.detectChanges();

		const transform = component.getHideTransform();
		expect(transform).toBe('translateX(-100%)');
	});

	it('should apply correct transform for center position', () => {
		hostComponent.toastConfig = { position: 'top-center' };
		fixture.detectChanges();

		const transform = component.getHideTransform();
		expect(transform).toBe('translateY(-100%)');
	});

	it('should apply custom class names', () => {
		hostComponent.toastConfig = {
			classNames: {
				container: 'custom-container-class',
				title: 'custom-title-class'
			}
		};
		hostComponent.toastData = { title: 'Test Title', message: 'Test message' };
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('[role="alert"]');
		const title = fixture.nativeElement.querySelector('h4');
		
		expect(container.className).toContain('custom-container-class');
		expect(title.className).toContain('custom-title-class');
	});
});
