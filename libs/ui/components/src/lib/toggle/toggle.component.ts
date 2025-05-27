import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface ToggleConfig {
	classNames?: {
		host?: string;
		container?: string;
		toggle?: string;
		knob?: string;
		label?: string;
		description?: string;
	};
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	labelPosition?: 'left' | 'right';
	color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export interface ToggleData {
	checked?: boolean;
	label?: string;
	description?: string;
	id?: string;
}

@Component({
	selector: 'ui-toggle',
	standalone: true,
	host: {
		class: 'inline-flex'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label && config().labelPosition === 'left') {
				<div class="mr-4">
					<label [for]="toggleId()" [class]="labelClasses()">
						{{ data().label }}
					</label>
					@if (data().description) {
						<p [class]="descriptionClasses()">{{ data().description }}</p>
					}
				</div>
			}
			
			<button
				[id]="toggleId()"
				type="button"
				role="switch"
				[attr.aria-checked]="data().checked || false"
				[class]="toggleClasses()"
				[disabled]="config().disabled || false"
				(click)="toggle()">
				<span [class]="knobClasses()" aria-hidden="true"></span>
			</button>
			
			@if (data().label && config().labelPosition !== 'left') {
				<div class="ml-4">
					<label [for]="toggleId()" [class]="labelClasses()">
						{{ data().label }}
					</label>
					@if (data().description) {
						<p [class]="descriptionClasses()">{{ data().description }}</p>
					}
				</div>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
	data = input.required<ToggleData>();
	config = input<ToggleConfig>({});
	
	onChange = output<boolean>();

	protected toggleId = computed(() => {
		return this.data().id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected containerClasses = computed(() => {
		const baseClasses = 'flex items-center';
		const alignmentClasses = this.config().labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row';
		
		return [
			baseClasses,
			alignmentClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected toggleClasses = computed(() => {
		const baseClasses = 'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
		
		const sizeClasses = {
			sm: 'h-5 w-9',
			md: 'h-6 w-11',
			lg: 'h-8 w-14'
		};

		const colorClasses = {
			blue: 'focus:ring-blue-500',
			green: 'focus:ring-green-500',
			purple: 'focus:ring-purple-500',
			red: 'focus:ring-red-500',
			yellow: 'focus:ring-yellow-500'
		};

		const backgroundClasses = this.getBackgroundClasses();
		const disabledClasses = this.config().disabled 
			? 'opacity-50 cursor-not-allowed' 
			: '';

		const size = this.config().size || 'md';
		const color = this.config().color || 'blue';

		return [
			baseClasses,
			sizeClasses[size],
			colorClasses[color],
			backgroundClasses,
			disabledClasses,
			this.config().classNames?.toggle || ''
		].filter(Boolean).join(' ');
	});

	protected knobClasses = computed(() => {
		const baseClasses = 'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out';
		
		const sizeClasses = {
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-7 w-7'
		};

		const transformClasses = this.getKnobTransformClasses();

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			transformClasses,
			this.config().classNames?.knob || ''
		].filter(Boolean).join(' ');
	});

	protected labelClasses = computed(() => {
		const baseClasses = 'block text-sm font-medium text-gray-900 dark:text-gray-100';
		const cursorClasses = this.config().disabled ? 'cursor-not-allowed' : 'cursor-pointer';
		
		return [
			baseClasses,
			cursorClasses,
			this.config().classNames?.label || ''
		].filter(Boolean).join(' ');
	});

	protected descriptionClasses = computed(() => {
		const baseClasses = 'text-sm text-gray-600 dark:text-gray-400 mt-1';
		
		return [
			baseClasses,
			this.config().classNames?.description || ''
		].filter(Boolean).join(' ');
	});

	private getBackgroundClasses(): string {
		const isChecked = this.data().checked || false;
		const color = this.config().color || 'blue';
		
		if (isChecked) {
			const checkedColors = {
				blue: 'bg-blue-600',
				green: 'bg-green-600',
				purple: 'bg-purple-600',
				red: 'bg-red-600',
				yellow: 'bg-yellow-600'
			};
			return checkedColors[color];
		}
		
		return 'bg-gray-200 dark:bg-gray-700';
	}

	private getKnobTransformClasses(): string {
		const isChecked = this.data().checked || false;
		const size = this.config().size || 'md';
		
		if (isChecked) {
			const transformClasses = {
				sm: 'translate-x-4',
				md: 'translate-x-5',
				lg: 'translate-x-6'
			};
			return transformClasses[size];
		}
		
		return 'translate-x-0';
	}

	protected toggle(): void {
		if (!this.config().disabled) {
			const newValue = !(this.data().checked || false);
			this.onChange.emit(newValue);
		}
	}
}
