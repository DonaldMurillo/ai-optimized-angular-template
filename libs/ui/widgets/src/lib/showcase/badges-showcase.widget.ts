import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BadgeComponent } from '@ui/components';

@Component({
	selector: 'ui-badges-showcase-widget',
	standalone: true,
	imports: [BadgeComponent],
	host: {
		class: 'block'
	},
	template: `
		<section class="scroll-mt-24">
			<div class="text-center mb-12">
				<div class="inline-flex items-center gap-3 mb-4">
					<span class="text-2xl">🏷️</span>
					<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Badge Components
					</h2>
				</div>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Versatile badges for status indicators, labels, and categorization
				</p>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Status Badges -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Status Indicators</h3>
					</div>
					<div class="space-y-3">
						@for (color of statusColors(); track color) {
							<ui-badge 
								[data]="{ text: color + ' Status' }"
								[config]="{ variant: 'status', color: color, showDot: true }">
							</ui-badge>
						}
					</div>
				</div>

				<!-- Tech Badges -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Technology Tags</h3>
					</div>
					<div class="flex flex-wrap gap-2">
						@for (tech of techStack(); track tech) {
							<ui-badge 
								[data]="{ text: tech }"
								[config]="{ variant: 'tech', color: 'gray' }">
							</ui-badge>
						}
					</div>
				</div>

				<!-- Animated Badges -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Live Updates</h3>
					</div>
					<div class="space-y-3">
						<div class="animate-pulse">
							<ui-badge 
								[data]="{ text: 'Live Status', icon: '🟢' }"
								[config]="{ variant: 'status', color: 'green', showDot: true }">
							</ui-badge>
						</div>
						<div class="animate-bounce">
							<ui-badge 
								[data]="{ text: 'Processing', icon: '⚡' }"
								[config]="{ variant: 'status', color: 'yellow', showDot: true }">
							</ui-badge>
						</div>
						<div class="animate-ping">
							<ui-badge 
								[data]="{ text: 'Critical Alert', icon: '🚨' }"
								[config]="{ variant: 'status', color: 'red', showDot: true }">
							</ui-badge>
						</div>
						<div class="animate-spin">
							<ui-badge 
								[data]="{ text: 'Loading', icon: '⏳' }"
								[config]="{ variant: 'status', color: 'blue', showDot: true }">
							</ui-badge>
						</div>
						<div class="animate-pulse hover:animate-bounce transition-all duration-300">
							<ui-badge 
								[data]="{ text: 'Interactive', icon: '✨' }"
								[config]="{ variant: 'status', color: 'purple', showDot: true }">
							</ui-badge>
						</div>
					</div>
				</div>
			</div>

			<!-- Additional Badge Showcase -->
			<div class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
				<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
					Badge Variants & Colors
				</h3>
				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
					@for (variant of badgeVariants(); track variant.name) {
						<div class="text-center">
							<ui-badge 
								[data]="{ text: variant.name }"
								[config]="{ variant: variant.type, color: variant.color }">
							</ui-badge>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ variant.description }}</p>
						</div>
					}
				</div>
			</div>
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgesShowcaseWidget {
	// Built-in status colors
	statusColors = signal<('green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray')[]>(['green', 'yellow', 'red', 'blue', 'purple', 'gray']);

	// Built-in tech stack
	techStack = signal([
		'Angular', 'TypeScript', 'Tailwind CSS', 'Nx', 'RxJS', 'Node.js',
		'Signals', 'OnPush', 'Standalone', 'SSR', 'Vite', 'Jest'
	]);

	// Built-in badge variants
	badgeVariants = signal<Array<{
		name: string;
		type: 'status' | 'tech' | 'feature';
		color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray';
		description: string;
	}>>([
		{ name: 'Success', type: 'status', color: 'green', description: 'Success state' },
		{ name: 'Warning', type: 'status', color: 'yellow', description: 'Warning state' },
		{ name: 'Error', type: 'status', color: 'red', description: 'Error state' },
		{ name: 'Info', type: 'status', color: 'blue', description: 'Info state' },
		{ name: 'Tech', type: 'tech', color: 'gray', description: 'Technology tag' },
		{ name: 'Feature', type: 'feature', color: 'purple', description: 'Feature badge' }
	]);
}
