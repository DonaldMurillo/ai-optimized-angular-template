import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface BadgeConfig {
	classNames?: {
		host?: string;
		container?: string;
		dot?: string;
		text?: string;
	};
	variant?: 'status' | 'tech' | 'feature';
	color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray';
	size?: 'sm' | 'md' | 'lg';
	showDot?: boolean;
	animate?: boolean;
}

export interface BadgeData {
	text: string;
	icon?: string;
}

@Component({
	selector: 'ui-badge',
	standalone: true,
	host: {
		class: 'inline-flex'
	},
	template: `
		<div [class]="containerClasses()">
			@if (config().showDot) {
				<span [class]="dotClasses()"></span>
			}
			@if (data().icon) {
				<span class="mr-1">{{ data().icon }}</span>
			}
			<span [class]="textClasses()">{{ data().text }}</span>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
	data = input.required<BadgeData>();
	config = input<BadgeConfig>({});

	protected containerClasses = computed(() => {
		const baseClasses = 'inline-flex items-center gap-2 rounded-full font-medium';
		
		const variantClasses = {
			status: 'px-4 py-2',
			tech: 'px-3 py-1 border',
			feature: 'px-3 py-1'
		};

		const colorClasses = {
			blue: this.getColorClasses('blue'),
			green: this.getColorClasses('green'),
			purple: this.getColorClasses('purple'),
			red: this.getColorClasses('red'),
			yellow: this.getColorClasses('yellow'),
			gray: this.getColorClasses('gray')
		};

		const sizeClasses = {
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base'
		};

		const variant = this.config().variant || 'status';
		const color = this.config().color || 'blue';
		const size = this.config().size || 'sm';

		return [
			baseClasses,
			variantClasses[variant],
			colorClasses[color],
			sizeClasses[size],
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected dotClasses = computed(() => {
		const baseClasses = 'w-2 h-2 rounded-full';
		const color = this.config().color || 'blue';
		const animateClass = this.config().animate ? 'animate-pulse' : '';
		
		const dotColorClasses = {
			blue: 'bg-blue-500',
			green: 'bg-green-500',
			purple: 'bg-purple-500',
			red: 'bg-red-500',
			yellow: 'bg-yellow-500',
			gray: 'bg-gray-500'
		};

		return [
			baseClasses,
			dotColorClasses[color],
			animateClass,
			this.config().classNames?.dot || ''
		].filter(Boolean).join(' ');
	});

	protected textClasses = computed(() => {
		return this.config().classNames?.text || '';
	});

	private getColorClasses(color: string): string {
		const variant = this.config().variant || 'status';
		
		if (variant === 'status') {
			const statusColors = {
				blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
				green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
				purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
				red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
				yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
				gray: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
			};
			return statusColors[color as keyof typeof statusColors] || statusColors.blue;
		}
		
		if (variant === 'tech') {
			return 'bg-slate-800 border-slate-700 text-white';
		}
		
		return 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300';
	}
}
