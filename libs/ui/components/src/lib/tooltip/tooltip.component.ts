import { Component, ChangeDetectionStrategy, input, computed, signal, inject, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface TooltipConfig {
	classNames?: {
		host?: string;
		tooltip?: string;
		arrow?: string;
	};
	position?: 'top' | 'bottom' | 'left' | 'right';
	trigger?: 'hover' | 'click' | 'focus';
	delay?: number;
	offset?: number;
	arrow?: boolean;
	maxWidth?: string;
}

export interface TooltipData {
	content: string;
	disabled?: boolean;
}

@Component({
	selector: 'ui-tooltip',
	standalone: true,
	host: {
		class: 'relative inline-block'
	},
	template: `
		<div 
			class="relative inline-block"
			(mouseenter)="onMouseEnter()"
			(mouseleave)="onMouseLeave()"
			(focusin)="onFocusIn()"
			(focusout)="onFocusOut()"
			(click)="onClick()">
			<ng-content></ng-content>
			
			@if (isVisible() && !data().disabled) {
				<div 
					[class]="tooltipClasses()"
					[style.max-width]="config().maxWidth || '200px'"
					role="tooltip">
					{{ data().content }}
					
					@if (config().arrow !== false) {
						<div [class]="arrowClasses()"></div>
					}
				</div>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements OnInit, OnDestroy {
	data = input.required<TooltipData>();
	config = input<TooltipConfig>({});

	private document = inject(DOCUMENT);
	private elementRef = inject(ElementRef);
	
	isVisible = signal(false);
	private showTimeout?: number;
	private hideTimeout?: number;

	ngOnInit(): void {
		// Setup event listeners if needed
	}

	ngOnDestroy(): void {
		this.clearTimeouts();
	}

	protected onMouseEnter(): void {
		if (this.config().trigger === 'hover' || !this.config().trigger) {
			this.showTooltip();
		}
	}

	protected onMouseLeave(): void {
		if (this.config().trigger === 'hover' || !this.config().trigger) {
			this.hideTooltip();
		}
	}

	protected onFocusIn(): void {
		if (this.config().trigger === 'focus') {
			this.showTooltip();
		}
	}

	protected onFocusOut(): void {
		if (this.config().trigger === 'focus') {
			this.hideTooltip();
		}
	}

	protected onClick(): void {
		if (this.config().trigger === 'click') {
			if (this.isVisible()) {
				this.hideTooltip();
			} else {
				this.showTooltip();
			}
		}
	}

	private showTooltip(): void {
		this.clearTimeouts();
		const delay = this.config().delay || 500;
		
		this.showTimeout = this.document.defaultView?.setTimeout(() => {
			this.isVisible.set(true);
		}, delay) as number;
	}

	private hideTooltip(): void {
		this.clearTimeouts();
		this.hideTimeout = this.document.defaultView?.setTimeout(() => {
			this.isVisible.set(false);
		}, 100) as number;
	}

	private clearTimeouts(): void {
		if (this.showTimeout) {
			this.document.defaultView?.clearTimeout(this.showTimeout);
			this.showTimeout = undefined;
		}
		if (this.hideTimeout) {
			this.document.defaultView?.clearTimeout(this.hideTimeout);
			this.hideTimeout = undefined;
		}
	}

	protected tooltipClasses = computed(() => {
		const baseClasses = 'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip transition-opacity duration-300';
		const visibleClasses = this.isVisible() ? 'opacity-100' : 'opacity-0';
		
		const positionClasses = {
			top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
			bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
			left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
			right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
		};

		const position = this.config().position || 'top';
		const offset = this.config().offset || 0;
		
		// Apply custom offset if provided
		const offsetClasses = offset > 0 ? this.getOffsetClasses(position, offset) : '';

		return [
			baseClasses,
			visibleClasses,
			positionClasses[position],
			offsetClasses,
			this.config().classNames?.tooltip || ''
		].filter(Boolean).join(' ');
	});

	protected arrowClasses = computed(() => {
		const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
		
		const positionClasses = {
			top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
			bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
			left: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
			right: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
		};

		const position = this.config().position || 'top';

		return [
			baseClasses,
			positionClasses[position],
			this.config().classNames?.arrow || ''
		].filter(Boolean).join(' ');
	});

	private getOffsetClasses(position: string, offset: number): string {
		switch (position) {
			case 'top':
				return `mb-${offset}`;
			case 'bottom':
				return `mt-${offset}`;
			case 'left':
				return `mr-${offset}`;
			case 'right':
				return `ml-${offset}`;
			default:
				return '';
		}
	}
}
