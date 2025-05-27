import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface CodeWindowConfig {
	classNames?: {
		host?: string;
		container?: string;
		header?: string;
		title?: string;
		content?: string;
	};
	variant?: 'terminal' | 'code';
	showControls?: boolean;
}

export interface CodeWindowData {
	title?: string;
	lines: Array<{
		type?: 'comment' | 'keyword' | 'string' | 'variable' | 'normal';
		content: string;
		indent?: number;
	}>;
}

@Component({
	selector: 'ui-code-window',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		<div [class]="containerClasses()">
			<div [class]="headerClasses()">
				@if (config().showControls !== false) {
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 bg-red-500 rounded-full"></div>
						<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
					</div>
				}
				@if (data().title) {
					<span [class]="titleClasses()">{{ data().title }}</span>
				}
			</div>
			<div [class]="contentClasses()">
				@for (line of data().lines; track $index) {
					<div [class]="getLineClasses(line)" [style.margin-left.rem]="(line.indent || 0) * 1">
						{{ line.content }}
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeWindowComponent {
	data = input.required<CodeWindowData>();
	config = input<CodeWindowConfig>({});

	protected containerClasses = computed(() => {
		const baseClasses = 'bg-slate-900 dark:bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected headerClasses = computed(() => {
		const baseClasses = 'flex items-center gap-2 p-4 border-b border-slate-700';
		
		return [
			baseClasses,
			this.config().classNames?.header || ''
		].filter(Boolean).join(' ');
	});

	protected titleClasses = computed(() => {
		const baseClasses = 'text-slate-400 text-sm ml-2';
		
		return [
			baseClasses,
			this.config().classNames?.title || ''
		].filter(Boolean).join(' ');
	});

	protected contentClasses = computed(() => {
		const baseClasses = 'p-6 space-y-2 text-sm font-mono overflow-x-auto';
		
		return [
			baseClasses,
			this.config().classNames?.content || ''
		].filter(Boolean).join(' ');
	});

	protected getLineClasses(line: { type?: string; content: string; indent?: number }): string {
		const typeClasses = {
			comment: 'text-green-400',
			keyword: 'text-blue-400',
			string: 'text-yellow-400',
			variable: 'text-purple-400',
			normal: 'text-slate-300'
		};

		const type = line.type || 'normal';
		return typeClasses[type as keyof typeof typeClasses] || typeClasses.normal;
	}
}
