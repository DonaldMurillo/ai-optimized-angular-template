import { Component, ChangeDetectionStrategy, input, computed, output, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ToastConfig {
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
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
	duration?: number; // in milliseconds, 0 = no auto dismiss
	showIcon?: boolean;
	dismissible?: boolean;
	rounded?: boolean;
}

export interface ToastData {
	title?: string;
	message: string;
	id?: string;
}

@Component({
	selector: 'ui-toast',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		<div 
			[class]="containerClasses()"
			role="alert"
			aria-live="polite"
			[style.transform]="isVisible() ? 'translateX(0)' : getHideTransform()"
			[style.opacity]="isVisible() ? '1' : '0'">
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
					<h4 [class]="titleClasses()">{{ data().title }}</h4>
				}
				<p [class]="messageClasses()">{{ data().message }}</p>
			</div>
			
			@if (config().dismissible !== false) {
				<button 
					type="button"
					[class]="closeButtonClasses()"
					(click)="dismiss()"
					aria-label="Dismiss notification">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</button>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
	data = input.required<ToastData>();
	config = input<ToastConfig>({});
	
	onDismiss = output<void>();

	private document = inject(DOCUMENT);
	isVisible = signal(false);
	private timeoutId?: number;

	ngOnInit(): void {
		// Show toast with animation
		setTimeout(() => this.isVisible.set(true), 100);
		
		// Auto dismiss if duration is set
		const duration = this.config().duration;
		if (duration && duration > 0) {
			this.timeoutId = this.document.defaultView?.setTimeout(() => {
				this.dismiss();
			}, duration) as number;
		}
	}

	ngOnDestroy(): void {
		if (this.timeoutId) {
			this.document.defaultView?.clearTimeout(this.timeoutId);
		}
	}

	protected dismiss(): void {
		this.isVisible.set(false);
		// Wait for animation to complete before emitting dismiss
		setTimeout(() => this.onDismiss.emit(), 300);
	}

	public getHideTransform(): string {
		const position = this.config().position || 'top-right';
		if (position.includes('right')) return 'translateX(100%)';
		if (position.includes('left')) return 'translateX(-100%)';
		return 'translateY(-100%)';
	}

	protected containerClasses = computed(() => {
		const baseClasses = 'flex items-start p-4 max-w-sm shadow-lg border transition-all duration-300 ease-in-out transform';
		
		const variantClasses = {
			success: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
			warning: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
			error: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
			info: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
		};

		const roundedClasses = this.config().rounded !== false ? 'rounded-lg' : '';

		const variant = this.config().variant || 'info';

		return [
			baseClasses,
			variantClasses[variant],
			roundedClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected iconClasses = computed(() => {
		const baseClasses = 'flex-shrink-0 mr-3';
		
		return [
			baseClasses,
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
		const baseClasses = 'font-medium text-sm mb-1';
		
		return [
			baseClasses,
			this.config().classNames?.title || ''
		].filter(Boolean).join(' ');
	});

	protected messageClasses = computed(() => {
		const baseClasses = 'text-sm';
		
		return [
			baseClasses,
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
