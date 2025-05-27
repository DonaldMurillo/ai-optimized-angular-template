import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface CheckboxConfig {
	classNames?: {
		host?: string;
		container?: string;
		checkbox?: string;
		label?: string;
		description?: string;
	};
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	indeterminate?: boolean;
	labelPosition?: 'left' | 'right';
}

export interface CheckboxData {
	checked?: boolean;
	value?: string | number;
	label?: string;
	description?: string;
	id?: string;
}

@Component({
	selector: 'ui-checkbox',
	standalone: true,
	host: {
		class: 'inline-flex'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label && config().labelPosition === 'left') {
				<div class="mr-3">
					<label [for]="checkboxId()" [class]="labelClasses()">
						{{ data().label }}
					</label>
					@if (data().description) {
						<p [class]="descriptionClasses()">{{ data().description }}</p>
					}
				</div>
			}
			
			<div class="relative">
				<input
					[id]="checkboxId()"
					type="checkbox"
					[class]="checkboxClasses()"
					[checked]="data().checked || false"
					[disabled]="config().disabled || false"
					[value]="data().value || ''"
					(change)="handleChange($event)"
				/>
				
				@if (config().indeterminate) {
					<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
						<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
						</svg>
					</div>
				}
			</div>
			
			@if (data().label && config().labelPosition !== 'left') {
				<div class="ml-3">
					<label [for]="checkboxId()" [class]="labelClasses()">
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
export class CheckboxComponent {
	data = input.required<CheckboxData>();
	config = input<CheckboxConfig>({});
	
	onChange = output<boolean>();

	protected checkboxId = computed(() => {
		return this.data().id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected containerClasses = computed(() => {
		const baseClasses = 'flex items-start';
		const alignmentClasses = this.config().labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row';
		
		return [
			baseClasses,
			alignmentClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected checkboxClasses = computed(() => {
		const baseClasses = 'rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200';
		
		const sizeClasses = {
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-6 w-6'
		};

		const disabledClasses = this.config().disabled 
			? 'opacity-50 cursor-not-allowed' 
			: 'cursor-pointer';

		const indeterminateClasses = this.config().indeterminate 
			? 'bg-blue-600 border-blue-600' 
			: '';

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			disabledClasses,
			indeterminateClasses,
			this.config().classNames?.checkbox || ''
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

	protected handleChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.onChange.emit(target.checked);
	}
}
