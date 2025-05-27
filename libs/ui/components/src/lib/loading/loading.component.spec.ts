import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { LoadingComponent, LoadingData, LoadingConfig } from './loading.component';

@Component({
	template: `
		<ui-loading 
			[data]="loadingData" 
			[config]="loadingConfig">
		</ui-loading>
	`
})
class TestHostComponent {
	loadingData: LoadingData = { show: true };
	loadingConfig: LoadingConfig = {};
}

describe('LoadingComponent', () => {
	let component: LoadingComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoadingComponent],
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

	it('should show loading indicator when show is true', () => {
		hostComponent.loadingData = { show: true };
		fixture.detectChanges();

		const loadingElement = fixture.nativeElement.querySelector('.animate-spin, .animate-pulse, .animate-bounce');
		expect(loadingElement).toBeTruthy();
	});

	it('should hide loading indicator when show is false', () => {
		hostComponent.loadingData = { show: false };
		fixture.detectChanges();

		const loadingElement = fixture.nativeElement.querySelector('.animate-spin, .animate-pulse, .animate-bounce');
		expect(loadingElement).toBeFalsy();
	});

	it('should display text when provided', () => {
		hostComponent.loadingData = { show: true, text: 'Loading data...' };
		fixture.detectChanges();

		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('Loading data...');
	});

	it('should apply spinner type classes', () => {
		hostComponent.loadingConfig = { type: 'spinner' };
		fixture.detectChanges();

		const spinnerElement = fixture.nativeElement.querySelector('.animate-spin');
		expect(spinnerElement).toBeTruthy();
	});

	it('should apply dots type classes', () => {
		hostComponent.loadingConfig = { type: 'dots' };
		fixture.detectChanges();

		const dotsElement = fixture.nativeElement.querySelector('.animate-bounce');
		expect(dotsElement).toBeTruthy();
	});

	it('should apply pulse type classes', () => {
		hostComponent.loadingConfig = { type: 'pulse' };
		fixture.detectChanges();

		const pulseElement = fixture.nativeElement.querySelector('.animate-pulse');
		expect(pulseElement).toBeTruthy();
	});

	it('should apply size classes', () => {
		hostComponent.loadingConfig = { size: 'lg' };
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('div');
		expect(container.className).toContain('w-12 h-12');
	});

	it('should apply color classes', () => {
		hostComponent.loadingConfig = { color: 'primary' };
		fixture.detectChanges();

		const spinner = fixture.nativeElement.querySelector('div div');
		expect(spinner.className).toContain('text-blue-600');
	});

	it('should apply custom class names', () => {
		hostComponent.loadingConfig = {
			classNames: {
				container: 'custom-container-class',
				spinner: 'custom-spinner-class'
			}
		};
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('div');
		const spinner = container.querySelector('div');
		
		expect(container.className).toContain('custom-container-class');
		expect(spinner.className).toContain('custom-spinner-class');
	});

	it('should show overlay when overlay is true', () => {
		hostComponent.loadingConfig = { overlay: true };
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('div');
		expect(container.className).toContain('absolute');
		expect(container.className).toContain('inset-0');
	});

	it('should show fullscreen when fullScreen is true', () => {
		hostComponent.loadingConfig = { fullScreen: true };
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('div');
		expect(container.className).toContain('fixed');
		expect(container.className).toContain('inset-0');
	});
});
