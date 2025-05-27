import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface LoadingConfig {
	classNames?: {
		host?: string;
		container?: string;
		spinner?: string;
		text?: string;
	};
	type?: 'spinner' | 'dots' | 'pulse' | 'bars';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white';
	overlay?: boolean;
	fullScreen?: boolean;
}

export interface LoadingData {
	text?: string;
	show: boolean;
}

@Component({
	selector: 'ui-loading',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		@if (data().show) {
			<div [class]="containerClasses()">
				<div [class]="spinnerClasses()">
					@switch (config().type || 'spinner') {
						@case ('spinner') {
							<svg class="animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						}
						@case ('dots') {
							<div class="flex space-x-1">
								<div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
								<div class="w-2 h-2 bg-current rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
								<div class="w-2 h-2 bg-current rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
							</div>
						}
						@case ('pulse') {
							<div class="w-8 h-8 bg-current rounded-full animate-pulse opacity-60"></div>
						}
						@case ('bars') {
							<div class="flex space-x-1">
								<div class="w-1 h-6 bg-current animate-pulse"></div>
								<div class="w-1 h-6 bg-current animate-pulse" style="animation-delay: 0.1s"></div>
								<div class="w-1 h-6 bg-current animate-pulse" style="animation-delay: 0.2s"></div>
								<div class="w-1 h-6 bg-current animate-pulse" style="animation-delay: 0.3s"></div>
							</div>
						}
					}
				</div>
				
				@if (data().text) {
					<p [class]="textClasses()">{{ data().text }}</p>
				}
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
	data = input.required<LoadingData>();
	config = input<LoadingConfig>({});

	protected containerClasses = computed(() => {
		const baseClasses = 'flex flex-col items-center justify-center';
		
		const overlayClasses = this.config().overlay 
			? 'absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 z-50' 
			: '';

		const fullScreenClasses = this.config().fullScreen 
			? 'fixed inset-0 min-h-screen' 
			: 'p-4';

		const spacingClasses = this.data().text ? 'space-y-3' : '';

		return [
			baseClasses,
			overlayClasses,
			fullScreenClasses,
			spacingClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected spinnerClasses = computed(() => {
		const sizeClasses = {
			xs: 'w-4 h-4',
			sm: 'w-6 h-6',
			md: 'w-8 h-8',
			lg: 'w-12 h-12',
			xl: 'w-16 h-16'
		};

		const colorClasses = {
			primary: 'text-blue-500',
			secondary: 'text-gray-500',
			success: 'text-green-500',
			warning: 'text-yellow-500',
			error: 'text-red-500',
			white: 'text-white'
		};

		const size = this.config().size || 'md';
		const color = this.config().color || 'primary';

		return [
			sizeClasses[size],
			colorClasses[color],
			this.config().classNames?.spinner || ''
		].filter(Boolean).join(' ');
	});

	protected textClasses = computed(() => {
		const baseClasses = 'text-sm font-medium';
		
		const colorClasses = {
			primary: 'text-blue-700 dark:text-blue-300',
			secondary: 'text-gray-700 dark:text-gray-300',
			success: 'text-green-700 dark:text-green-300',
			warning: 'text-yellow-700 dark:text-yellow-300',
			error: 'text-red-700 dark:text-red-300',
			white: 'text-white'
		};

		const color = this.config().color || 'primary';

		return [
			baseClasses,
			colorClasses[color],
			this.config().classNames?.text || ''
		].filter(Boolean).join(' ');
	});
}
