import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface AlertConfig {
	classNames?: {
		host?: string;
		container?: string;
		icon?: string;
		content?: string;
		title?: string;
		message?: string;
		closeButton?: string;
	};
	variant?: 'success' | 'warning' | 'error' | 'info';
	size?: 'sm' | 'md' | 'lg';
	dismissible?: boolean;
	showIcon?: boolean;
	rounded?: boolean;
}

export interface AlertData {
	title?: string;
	message: string;
	id?: string;
}

@Component({
	selector: 'ui-alert',
	standalone: true,
	host: {
		class: 'block w-full'
	},
	template: `
		<div [class]="containerClasses()" role="alert">
			@if (config().showIcon !== false) {
				<div [class]="iconClasses()">
					@switch (config().variant || 'info') {
						@case ('success') {
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
						}
						@case ('warning') {
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
							</svg>
						}
						@case ('error') {
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						}
						@default {
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
							</svg>
						}
					}
				</div>
			}
			
			<div [class]="contentClasses()">
				@if (data().title) {
					<h3 [class]="titleClasses()">{{ data().title }}</h3>
				}
				<p [class]="messageClasses()">{{ data().message }}</p>
			</div>
			
			@if (config().dismissible) {
				<button 
					type="button"
					[class]="closeButtonClasses()"
					(click)="onDismiss.emit()"
					aria-label="Dismiss alert">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</button>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
	data = input.required<AlertData>();
	config = input<AlertConfig>({});
	
	onDismiss = output<void>();

	protected containerClasses = computed(() => {
		const baseClasses = 'flex items-start p-4 border transition-all duration-200';
		
		const variantClasses = {
			success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
			warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
			error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
			info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
		};

		const sizeClasses = {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg'
		};

		const roundedClasses = this.config().rounded !== false ? 'rounded-lg' : '';

		const variant = this.config().variant || 'info';
		const size = this.config().size || 'md';

		return [
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			roundedClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected iconClasses = computed(() => {
		const baseClasses = 'flex-shrink-0';
		
		const sizeClasses = {
			sm: 'mr-2',
			md: 'mr-3',
			lg: 'mr-4'
		};

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			this.config().classNames?.icon || ''
		].filter(Boolean).join(' ');
	});

	protected contentClasses = computed(() => {
		const baseClasses = 'flex-1 min-w-0';
		
		return [
			baseClasses,
			this.config().classNames?.content || ''
		].filter(Boolean).join(' ');
	});

	protected titleClasses = computed(() => {
		const baseClasses = 'font-medium';
		
		const sizeClasses = {
			sm: 'text-sm mb-1',
			md: 'text-base mb-1',
			lg: 'text-lg mb-2'
		};

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			this.config().classNames?.title || ''
		].filter(Boolean).join(' ');
	});

	protected messageClasses = computed(() => {
		const baseClasses = '';
		
		const sizeClasses = {
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base'
		};

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			this.config().classNames?.message || ''
		].filter(Boolean).join(' ');
	});

	protected closeButtonClasses = computed(() => {
		const baseClasses = 'flex-shrink-0 ml-3 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
		
		const variantClasses = {
			success: 'focus:ring-green-500 focus:ring-offset-green-50 dark:focus:ring-offset-green-900',
			warning: 'focus:ring-yellow-500 focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900',
			error: 'focus:ring-red-500 focus:ring-offset-red-50 dark:focus:ring-offset-red-900',
			info: 'focus:ring-blue-500 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900'
		};

		const variant = this.config().variant || 'info';

		return [
			baseClasses,
			variantClasses[variant],
			this.config().classNames?.closeButton || ''
		].filter(Boolean).join(' ');
	});
}
