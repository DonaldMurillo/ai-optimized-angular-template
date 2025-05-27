import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface InputConfig {
	classNames?: {
		host?: string;
		container?: string;
		label?: string;
		input?: string;
		helperText?: string;
		icon?: string;
	};
	type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
	size?: 'sm' | 'md' | 'lg';
	state?: 'default' | 'success' | 'warning' | 'error';
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
	iconPosition?: 'prefix' | 'suffix';
}

export interface InputData {
	value?: string | number;
	placeholder?: string;
	label?: string;
	helperText?: string;
	icon?: string;
	id?: string;
}

@Component({
	selector: 'ui-input',
	standalone: true,
	host: {
		class: 'block w-full'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label) {
				<label 
					[for]="inputId()"
					[class]="labelClasses()">
					{{ data().label }}
					@if (config().required) {
						<span class="text-red-500 ml-1">*</span>
					}
				</label>
			}
			
			<div class="relative">
				@if (data().icon && config().iconPosition === 'prefix') {
					<div [class]="prefixIconClasses()">
						<span [class]="iconClasses()">{{ data().icon }}</span>
					</div>
				}
				
				<input
					[id]="inputId()"
					[type]="config().type || 'text'"
					[class]="inputClasses()"
					[placeholder]="data().placeholder || ''"
					[disabled]="config().disabled || false"
					[readonly]="config().readonly || false"
					[required]="config().required || false"
					[value]="data().value || ''"
					(input)="handleInput($event)"
					(focus)="onFocus.emit()"
					(blur)="onBlur.emit()"
				/>
				
				@if (data().icon && config().iconPosition === 'suffix') {
					<div [class]="suffixIconClasses()">
						<span [class]="iconClasses()">{{ data().icon }}</span>
					</div>
				}
			</div>
			
			@if (data().helperText) {
				<p [class]="helperTextClasses()">{{ data().helperText }}</p>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
	data = input.required<InputData>();
	config = input<InputConfig>({});
	
	onInput = output<string>();
	onFocus = output<void>();
	onBlur = output<void>();

	protected inputId = computed(() => {
		return this.data().id || `input-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected containerClasses = computed(() => {
		const baseClasses = 'space-y-2';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected labelClasses = computed(() => {
		const baseClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
		
		return [
			baseClasses,
			this.config().classNames?.label || ''
		].filter(Boolean).join(' ');
	});

	protected inputClasses = computed(() => {
		const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
		
		const sizeClasses = {
			sm: 'px-3 py-2 text-sm',
			md: 'px-4 py-3 text-base',
			lg: 'px-5 py-4 text-lg'
		};

		const stateClasses = {
			default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500',
			success: 'border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-green-500',
			warning: 'border-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-yellow-500',
			error: 'border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500'
		};

		const disabledClasses = this.config().disabled 
			? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' 
			: '';

		const iconPaddingClasses = this.data().icon 
			? this.config().iconPosition === 'prefix' 
				? 'pl-10' 
				: 'pr-10'
			: '';

		const size = this.config().size || 'md';
		const state = this.config().state || 'default';

		return [
			baseClasses,
			sizeClasses[size],
			stateClasses[state],
			disabledClasses,
			iconPaddingClasses,
			this.config().classNames?.input || ''
		].filter(Boolean).join(' ');
	});

	protected prefixIconClasses = computed(() => {
		return 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
	});

	protected suffixIconClasses = computed(() => {
		return 'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none';
	});

	protected iconClasses = computed(() => {
		const baseClasses = 'text-gray-400 dark:text-gray-500';
		
		return [
			baseClasses,
			this.config().classNames?.icon || ''
		].filter(Boolean).join(' ');
	});

	protected helperTextClasses = computed(() => {
		const baseClasses = 'text-sm';
		
		const stateClasses = {
			default: 'text-gray-600 dark:text-gray-400',
			success: 'text-green-600 dark:text-green-400',
			warning: 'text-yellow-600 dark:text-yellow-400',
			error: 'text-red-600 dark:text-red-400'
		};

		const state = this.config().state || 'default';

		return [
			baseClasses,
			stateClasses[state],
			this.config().classNames?.helperText || ''
		].filter(Boolean).join(' ');
	});

	protected handleInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.onInput.emit(target.value);
	}
}
