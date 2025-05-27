import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface ButtonConfig {
	classNames?: {
		host?: string;
		button?: string;
	};
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	loading?: boolean;
}

export interface ButtonData {
	text: string;
	icon?: string;
}

@Component({
	selector: 'ui-button',
	standalone: true,
	host: {
		class: 'inline-block'
	},
	template: `
		<button 
			[class]="buttonClasses()"
			[disabled]="config().disabled || config().loading"
			(click)="onClick.emit()"
			type="button">
			@if (config().loading) {
				<span class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" aria-hidden="true"></span>
			}
			@if (data().icon && !config().loading) {
				<span class="mr-2">{{ data().icon }}</span>
			}
			{{ data().text }}
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	data = input.required<ButtonData>();
	config = input<ButtonConfig>({});
	
	onClick = output<void>();

	protected buttonClasses = computed(() => {
		const baseClasses = 'font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
		
		const variantClasses = {
			primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-blue-500',
			secondary: 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-blue-500',
			ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500'
		};

		const sizeClasses = {
			sm: 'px-4 py-2 text-sm',
			md: 'px-6 py-3 text-base',
			lg: 'px-8 py-4 text-lg'
		};

		const variant = this.config().variant || 'primary';
		const size = this.config().size || 'md';

		return [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			this.config().classNames?.button || '',
			this.config().classNames?.host || ''
		].filter(Boolean).join(' ');
	});
}
