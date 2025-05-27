import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ProgressComponent, ProgressData, ProgressConfig } from './progress.component';

@Component({
	template: `
		<ui-progress 
			[data]="progressData" 
			[config]="progressConfig">
		</ui-progress>
	`
})
class TestHostComponent {
	progressData: ProgressData = { value: 50 };
	progressConfig: ProgressConfig = {};
}

describe('ProgressComponent', () => {
	let component: ProgressComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProgressComponent],
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

	it('should display progress value', () => {
		hostComponent.progressData = { value: 75 };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.getAttribute('aria-valuenow')).toBe('75');
		expect(progressBar.style.width).toBe('75%');
	});

	it('should display label when provided', () => {
		hostComponent.progressData = { value: 50, label: 'Upload Progress' };
		hostComponent.progressConfig = { showLabel: true };
		fixture.detectChanges();

		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('Upload Progress');
	});

	it('should display percentage when showPercentage is true', () => {
		hostComponent.progressData = { value: 60 };
		hostComponent.progressConfig = { showPercentage: true };
		fixture.detectChanges();

		const compiled = fixture.nativeElement;
		expect(compiled.textContent).toContain('60%');
	});

	it('should apply success variant classes', () => {
		hostComponent.progressConfig = { variant: 'success' };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.className).toContain('bg-green-600');
	});

	it('should apply error variant classes', () => {
		hostComponent.progressConfig = { variant: 'error' };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.className).toContain('bg-red-600');
	});

	it('should apply striped classes when striped is true', () => {
		hostComponent.progressConfig = { striped: true };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.className).toContain('bg-gradient-to-r');
	});

	it('should apply animated classes when animated is true', () => {
		hostComponent.progressConfig = { animated: true, striped: true };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.className).toContain('animate-pulse');
	});

	it('should show indeterminate progress when indeterminate is true', () => {
		hostComponent.progressConfig = { indeterminate: true };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.className).toContain('animate-pulse');
		expect(progressBar.style.width).toBe('100%');
	});

	it('should apply size classes', () => {
		hostComponent.progressConfig = { size: 'lg' };
		fixture.detectChanges();

		const track = fixture.nativeElement.querySelector('.bg-gray-200');
		expect(track.className).toContain('h-6');
	});

	it('should handle max value correctly', () => {
		hostComponent.progressData = { value: 30, max: 60 };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.getAttribute('aria-valuemax')).toBe('60');
		expect(progressBar.style.width).toBe('50%'); // 30/60 = 50%
	});

	it('should apply custom class names', () => {
		hostComponent.progressConfig = {
			classNames: {
				container: 'custom-container-class',
				track: 'custom-track-class',
				bar: 'custom-bar-class'
			}
		};
		fixture.detectChanges();

		const container = fixture.nativeElement.querySelector('div');
		const track = container.querySelector('.bg-gray-200');
		const bar = track.querySelector('[role="progressbar"]');
		
		expect(container.className).toContain('custom-container-class');
		expect(track.className).toContain('custom-track-class');
		expect(bar.className).toContain('custom-bar-class');
	});

	it('should clamp value between 0 and max', () => {
		hostComponent.progressData = { value: 150, max: 100 };
		fixture.detectChanges();

		const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
		expect(progressBar.style.width).toBe('100%');

		hostComponent.progressData = { value: -10 };
		fixture.detectChanges();

		expect(progressBar.style.width).toBe('0%');
	});
});
