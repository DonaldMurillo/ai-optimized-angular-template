import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface ProgressConfig {
	classNames?: {
		host?: string;
		container?: string;
		track?: string;
		bar?: string;
		label?: string;
		percentage?: string;
	};
	variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
	size?: 'sm' | 'md' | 'lg';
	showLabel?: boolean;
	showPercentage?: boolean;
	animated?: boolean;
	striped?: boolean;
	indeterminate?: boolean;
}

export interface ProgressData {
	value?: number; // 0-100
	max?: number;
	label?: string;
	id?: string;
}

@Component({
	selector: 'ui-progress',
	standalone: true,
	host: {
		class: 'block w-full'
	},
	template: `
		<div [class]="containerClasses()">
			@if (config().showLabel && data().label) {
				<div class="flex justify-between items-center mb-2">
					<span [class]="labelClasses()">{{ data().label }}</span>
					@if (config().showPercentage && !config().indeterminate) {
						<span [class]="percentageClasses()">{{ progressPercentage() }}%</span>
					}
				</div>
			}
			
			<div 
				[class]="trackClasses()"
				role="progressbar"
				[attr.aria-valuenow]="config().indeterminate ? null : progressValue()"
				[attr.aria-valuemin]="0"
				[attr.aria-valuemax]="data().max || 100"
				[attr.aria-label]="data().label">
				<div 
					[class]="barClasses()"
					[style.width]="config().indeterminate ? '100%' : progressPercentage() + '%'">
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
	data = input.required<ProgressData>();
	config = input<ProgressConfig>({});

	protected progressValue = computed(() => {
		return Math.max(0, Math.min(this.data().value || 0, this.data().max || 100));
	});

	protected progressPercentage = computed(() => {
		const max = this.data().max || 100;
		const value = this.progressValue();
		return Math.round((value / max) * 100);
	});

	protected containerClasses = computed(() => {
		const baseClasses = '';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected trackClasses = computed(() => {
		const baseClasses = 'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden';
		
		const sizeClasses = {
			sm: 'h-2',
			md: 'h-3',
			lg: 'h-4'
		};

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			this.config().classNames?.track || ''
		].filter(Boolean).join(' ');
	});

	protected barClasses = computed(() => {
		const baseClasses = 'h-full transition-all duration-300 ease-out';
		
		const variantClasses = {
			primary: 'bg-blue-500',
			secondary: 'bg-gray-500',
			success: 'bg-green-500',
			warning: 'bg-yellow-500',
			error: 'bg-red-500'
		};

		const animatedClasses = this.config().animated 
			? 'bg-gradient-to-r from-transparent via-white to-transparent bg-size-200 animate-pulse' 
			: '';

		const stripedClasses = this.config().striped 
			? 'bg-stripes bg-stripes-white' 
			: '';

		const indeterminateClasses = this.config().indeterminate 
			? 'animate-pulse bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600' 
			: '';

		const variant = this.config().variant || 'primary';

		return [
			baseClasses,
			this.config().indeterminate ? indeterminateClasses : variantClasses[variant],
			animatedClasses,
			stripedClasses,
			this.config().classNames?.bar || ''
		].filter(Boolean).join(' ');
	});

	protected labelClasses = computed(() => {
		const baseClasses = 'text-sm font-medium text-gray-700 dark:text-gray-300';
		
		return [
			baseClasses,
			this.config().classNames?.label || ''
		].filter(Boolean).join(' ');
	});

	protected percentageClasses = computed(() => {
		const baseClasses = 'text-sm font-medium text-gray-600 dark:text-gray-400';
		
		return [
			baseClasses,
			this.config().classNames?.percentage || ''
		].filter(Boolean).join(' ');
	});
}
