import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TooltipComponent, TooltipData, TooltipConfig } from './tooltip.component';

@Component({
	template: `
		<ui-tooltip 
			[data]="tooltipData" 
			[config]="tooltipConfig">
			<button>Hover me</button>
		</ui-tooltip>
	`
})
class TestHostComponent {
	tooltipData: TooltipData = { content: 'Test tooltip' };
	tooltipConfig: TooltipConfig = {};
}

describe('TooltipComponent', () => {
	let component: TooltipComponent;
	let hostComponent: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TooltipComponent],
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

	it('should show tooltip on hover trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		expect(component.isVisible()).toBe(true);
	});

	it('should hide tooltip on mouse leave with hover trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		triggerElement.dispatchEvent(new MouseEvent('mouseleave'));
		fixture.detectChanges();

		expect(component.isVisible()).toBe(false);
	});

	it('should show tooltip on click trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'click' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.click();
		fixture.detectChanges();

		expect(component.isVisible()).toBe(true);
	});

	it('should toggle tooltip on multiple clicks with click trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'click' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		
		triggerElement.click();
		fixture.detectChanges();
		expect(component.isVisible()).toBe(true);

		triggerElement.click();
		fixture.detectChanges();
		expect(component.isVisible()).toBe(false);
	});

	it('should show tooltip on focus trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'focus' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new FocusEvent('focus'));
		fixture.detectChanges();

		expect(component.isVisible()).toBe(true);
	});

	it('should hide tooltip on blur with focus trigger', () => {
		hostComponent.tooltipConfig = { trigger: 'focus' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new FocusEvent('focus'));
		fixture.detectChanges();

		triggerElement.dispatchEvent(new FocusEvent('blur'));
		fixture.detectChanges();

		expect(component.isVisible()).toBe(false);
	});

	it('should display tooltip content', () => {
		hostComponent.tooltipData = { content: 'Custom tooltip content' };
		hostComponent.tooltipConfig = { trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		expect(tooltipElement.textContent).toContain('Custom tooltip content');
	});

	it('should apply top position classes', () => {
		hostComponent.tooltipConfig = { position: 'top', trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		expect(tooltipElement.className).toContain('bottom-full');
		expect(tooltipElement.className).toContain('mb-2');
	});

	it('should apply bottom position classes', () => {
		hostComponent.tooltipConfig = { position: 'bottom', trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		expect(tooltipElement.className).toContain('top-full');
		expect(tooltipElement.className).toContain('mt-2');
	});

	it('should apply left position classes', () => {
		hostComponent.tooltipConfig = { position: 'left', trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		expect(tooltipElement.className).toContain('right-full');
		expect(tooltipElement.className).toContain('mr-2');
	});

	it('should apply right position classes', () => {
		hostComponent.tooltipConfig = { position: 'right', trigger: 'hover' };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		expect(tooltipElement.className).toContain('left-full');
		expect(tooltipElement.className).toContain('ml-2');
	});

	it('should respect delay configuration', () => {
		jest.useFakeTimers();
		
		hostComponent.tooltipConfig = { trigger: 'hover', delay: 500 };
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		// Should not be visible immediately
		expect(component.isVisible()).toBe(false);

		// Should be visible after delay
		jest.advanceTimersByTime(500);
		expect(component.isVisible()).toBe(true);

		jest.useRealTimers();
	});

	it('should apply custom class names', () => {
		hostComponent.tooltipConfig = {
			classNames: {
				tooltip: 'custom-tooltip-class',
				arrow: 'custom-arrow-class'
			},
			trigger: 'hover'
		};
		fixture.detectChanges();

		const triggerElement = fixture.nativeElement.querySelector('button');
		triggerElement.dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();

		const tooltipElement = fixture.nativeElement.querySelector('[role="tooltip"]');
		const arrowElement = tooltipElement.querySelector('.w-2');
		
		expect(tooltipElement.className).toContain('custom-tooltip-class');
		expect(arrowElement.className).toContain('custom-arrow-class');
	});
});
