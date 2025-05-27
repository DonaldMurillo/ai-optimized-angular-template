import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface CardConfig {
	classNames?: {
		host?: string;
		container?: string;
		icon?: string;
		title?: string;
		description?: string;
	};
	variant?: 'default' | 'feature' | 'tech-stack';
	hoverable?: boolean;
}

export interface CardData {
	icon?: string;
	title: string;
	description: string;
	gradient?: string;
}

@Component({
	selector: 'ui-card',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().icon) {
				<div [class]="iconClasses()">
					<span class="text-2xl">{{ data().icon }}</span>
				</div>
			}
			<h3 [class]="titleClasses()">{{ data().title }}</h3>
			<p [class]="descriptionClasses()">{{ data().description }}</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
	data = input.required<CardData>();
	config = input<CardConfig>({});

	protected containerClasses = computed(() => {
		const baseClasses = 'p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700';
		const hoverableClasses = this.config().hoverable !== false ? 'group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300' : '';
		
		return [
			baseClasses,
			hoverableClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected iconClasses = computed(() => {
		const baseClasses = 'w-12 h-12 rounded-lg flex items-center justify-center mb-4';
		const variantClasses = this.config().variant === 'tech-stack' 
			? 'text-white font-bold' 
			: 'group-hover:scale-110 transition-transform duration-200';
		
		const gradientClass = this.data().gradient ? `bg-gradient-to-br ${this.data().gradient}` : 'bg-gradient-to-br from-blue-500 to-purple-600';
		
		return [
			baseClasses,
			variantClasses,
			gradientClass,
			this.config().classNames?.icon || ''
		].filter(Boolean).join(' ');
	});

	protected titleClasses = computed(() => {
		const baseClasses = 'font-semibold text-slate-900 dark:text-slate-100 mb-2';
		const sizeClasses = this.config().variant === 'tech-stack' ? 'text-base' : 'text-xl';
		
		return [
			baseClasses,
			sizeClasses,
			this.config().classNames?.title || ''
		].filter(Boolean).join(' ');
	});

	protected descriptionClasses = computed(() => {
		const baseClasses = 'text-slate-600 dark:text-slate-300 leading-relaxed';
		const sizeClasses = this.config().variant === 'tech-stack' ? 'text-sm' : 'text-base';
		
		return [
			baseClasses,
			sizeClasses,
			this.config().classNames?.description || ''
		].filter(Boolean).join(' ');
	});
}
