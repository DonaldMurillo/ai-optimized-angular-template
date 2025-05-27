import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface TechStackItemConfig {
	classNames?: {
		host?: string;
		container?: string;
		iconContainer?: string;
		icon?: string;
		content?: string;
		name?: string;
		description?: string;
	};
}

export interface TechStackItemData {
	name: string;
	description: string;
	icon: string;
	gradient: string;
}

@Component({
	selector: 'ui-tech-stack-item',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		<div [class]="containerClasses()">
			<div [class]="iconContainerClasses()">
				<span [class]="iconClasses()">{{ data().icon }}</span>
			</div>
			<div [class]="contentClasses()">
				<h4 [class]="nameClasses()">{{ data().name }}</h4>
				<p [class]="descriptionClasses()">{{ data().description }}</p>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStackItemComponent {
	data = input.required<TechStackItemData>();
	config = input<TechStackItemConfig>({});

	protected containerClasses = computed(() => {
		const baseClasses = 'flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected iconContainerClasses = computed(() => {
		const baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold';
		const gradientClass = `bg-gradient-to-br ${this.data().gradient}`;
		
		return [
			baseClasses,
			gradientClass,
			this.config().classNames?.iconContainer || ''
		].filter(Boolean).join(' ');
	});

	protected iconClasses = computed(() => {
		return this.config().classNames?.icon || '';
	});

	protected contentClasses = computed(() => {
		return this.config().classNames?.content || '';
	});

	protected nameClasses = computed(() => {
		const baseClasses = 'font-semibold text-slate-900 dark:text-slate-100';
		
		return [
			baseClasses,
			this.config().classNames?.name || ''
		].filter(Boolean).join(' ');
	});

	protected descriptionClasses = computed(() => {
		const baseClasses = 'text-sm text-slate-600 dark:text-slate-400';
		
		return [
			baseClasses,
			this.config().classNames?.description || ''
		].filter(Boolean).join(' ');
	});
}
