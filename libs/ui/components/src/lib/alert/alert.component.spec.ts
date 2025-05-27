import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AlertComponent, AlertData, AlertConfig } from './alert.component';

@Component({
	template: `
		<ui-alert 
			[data]="alertData" 
			[config]="alertConfig"
			(onDismiss)="onDismissed()">
		</ui-alert>
	`
})
class TestHostComponent {
	alertData: AlertData = { message: 'Test message' };
	alertConfig: AlertConfig = {};
	onDismissed = jest.fn();
}

describe('AlertComponent', () => {
	let component: AlertComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AlertComponent],
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
		hostComponent.alertData = { title: 'Test Title', message: 'Test message' };
		fixture.detectChanges();

		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('Test Title');
		expect(compiled.textContent).toContain('Test message');
	});

	it('should apply success variant classes', () => {
		hostComponent.alertConfig = { variant: 'success' };
		fixture.detectChanges();

		const alertElement = fixture.nativeElement.querySelector('[role="alert"]');
		expect(alertElement.className).toContain('bg-green-50');
		expect(alertElement.className).toContain('text-green-800');
	});

	it('should apply error variant classes', () => {
		hostComponent.alertConfig = { variant: 'error' };
		fixture.detectChanges();

		const alertElement = fixture.nativeElement.querySelector('[role="alert"]');
		expect(alertElement.className).toContain('bg-red-50');
		expect(alertElement.className).toContain('text-red-800');
	});

	it('should show close button when dismissible', () => {
		hostComponent.alertConfig = { dismissible: true };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		expect(closeButton).toBeTruthy();
		expect(closeButton.getAttribute('aria-label')).toBe('Dismiss alert');
	});

	it('should hide close button when not dismissible', () => {
		hostComponent.alertConfig = { dismissible: false };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		expect(closeButton).toBeFalsy();
	});

	it('should emit onDismiss when close button is clicked', () => {
		hostComponent.alertConfig = { dismissible: true };
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('button');
		closeButton.click();

		expect(hostComponent.onDismissed).toHaveBeenCalled();
	});

	it('should show icon when showIcon is true', () => {
		hostComponent.alertConfig = { showIcon: true, variant: 'success' };
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('svg');
		expect(icon).toBeTruthy();
	});

	it('should hide icon when showIcon is false', () => {
		hostComponent.alertConfig = { showIcon: false };
		fixture.detectChanges();

		const icon = fixture.nativeElement.querySelector('svg');
		expect(icon).toBeFalsy();
	});

	it('should apply custom class names', () => {
		hostComponent.alertConfig = {
			classNames: {
				container: 'custom-container-class',
				title: 'custom-title-class'
			}
		};
		hostComponent.alertData = { title: 'Test Title', message: 'Test message' };
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('[role="alert"]');
		const title = fixture.nativeElement.querySelector('h3');
		
		expect(container.className).toContain('custom-container-class');
		expect(title.className).toContain('custom-title-class');
	});
});
