import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface TextareaConfig {
	classNames?: {
		host?: string;
		container?: string;
		label?: string;
		textarea?: string;
		helperText?: string;
	};
	rows?: number;
	maxRows?: number;
	autoResize?: boolean;
	resize?: 'none' | 'vertical' | 'horizontal' | 'both';
	state?: 'default' | 'success' | 'warning' | 'error';
	disabled?: boolean;
	readonly?: boolean;
	required?: boolean;
}

export interface TextareaData {
	value?: string;
	placeholder?: string;
	label?: string;
	helperText?: string;
	id?: string;
	maxLength?: number;
}

@Component({
	selector: 'ui-textarea',
	standalone: true,
	host: {
		class: 'block w-full'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label) {
				<label 
					[for]="textareaId()"
					[class]="labelClasses()">
					{{ data().label }}
					@if (config().required) {
						<span class="text-red-500 ml-1">*</span>
					}
				</label>
			}
			
			<div class="relative">
				<textarea
					[id]="textareaId()"
					[class]="textareaClasses()"
					[placeholder]="data().placeholder || ''"
					[disabled]="config().disabled || false"
					[readonly]="config().readonly || false"
					[required]="config().required || false"
					[rows]="config().rows || 4"
					[attr.maxlength]="data().maxLength"
					[value]="data().value || ''"
					[style.resize]="config().resize || 'vertical'"
					(input)="handleInput($event)"
					(focus)="onFocus.emit()"
					(blur)="onBlur.emit()">
				</textarea>
				
				@if (data().maxLength && showCharCount()) {
					<div class="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1">
						{{ currentLength() }}/{{ data().maxLength }}
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
export class TextareaComponent {
	data = input.required<TextareaData>();
	config = input<TextareaConfig>({});
	
	onInput = output<string>();
	onFocus = output<void>();
	onBlur = output<void>();

	protected textareaId = computed(() => {
		return this.data().id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected currentLength = computed(() => {
		return (this.data().value || '').length;
	});

	protected showCharCount = computed(() => {
		const maxLength = this.data().maxLength || 0;
		return maxLength && maxLength > 0;
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

	protected textareaClasses = computed(() => {
		const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 px-4 py-3 text-base';
		
		const stateClasses = {
			default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500',
			success: 'border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-green-500',
			warning: 'border-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-yellow-500',
			error: 'border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500'
		};

		const disabledClasses = this.config().disabled 
			? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' 
			: '';

		const resizeClasses = this.config().autoResize ? 'resize-none' : '';

		const state = this.config().state || 'default';

		return [
			baseClasses,
			stateClasses[state],
			disabledClasses,
			resizeClasses,
			this.config().classNames?.textarea || ''
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
		const target = event.target as HTMLTextAreaElement;
		
		// Auto-resize functionality
		if (this.config().autoResize) {
			target.style.height = 'auto';
			const maxRows = this.config().maxRows || 10;
			const lineHeight = parseInt(getComputedStyle(target).lineHeight || '24');
			const maxHeight = lineHeight * maxRows;
			target.style.height = Math.min(target.scrollHeight, maxHeight) + 'px';
		}
		
		this.onInput.emit(target.value);
	}
}
