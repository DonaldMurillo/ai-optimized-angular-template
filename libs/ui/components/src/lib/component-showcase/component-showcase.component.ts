import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { CodeWindowComponent } from '../code-window/code-window.component';
import { TechStackItemComponent } from '../tech-stack-item/tech-stack-item.component';

@Component({
	selector: 'ui-component-showcase',
	standalone: true,
	imports: [
		ButtonComponent,
		CardComponent,
		CodeWindowComponent,
		BadgeComponent,
		TechStackItemComponent
	],
	host: {
		class: 'block p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'
	},
	template: `
		<div class="max-w-6xl mx-auto space-y-12">
			<div class="text-center">
				<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					🎨 Component Showcase
				</h1>
				<p class="text-lg text-gray-600 dark:text-gray-300">
					A demonstration of all reusable UI components extracted from the pages component
				</p>
			</div>

			<!-- Buttons Section -->
			<section class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Button Components
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Primary Buttons</h3>
						<div class="space-y-2">
							<ui-button 
								[data]="{ text: 'Small Primary', icon: '🚀' }"
								[config]="{ variant: 'primary', size: 'sm' }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Medium Primary' }"
								[config]="{ variant: 'primary', size: 'md' }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Large Primary' }"
								[config]="{ variant: 'primary', size: 'lg' }">
							</ui-button>
						</div>
					</div>
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Secondary Buttons</h3>
						<div class="space-y-2">
							<ui-button 
								[data]="{ text: 'Small Secondary' }"
								[config]="{ variant: 'secondary', size: 'sm' }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Medium Secondary' }"
								[config]="{ variant: 'secondary', size: 'md' }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Large Secondary' }"
								[config]="{ variant: 'secondary', size: 'lg' }">
							</ui-button>
						</div>
					</div>
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Special States</h3>
						<div class="space-y-2">
							<ui-button 
								[data]="{ text: 'Loading...' }"
								[config]="{ variant: 'primary', loading: true }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Disabled' }"
								[config]="{ variant: 'secondary', disabled: true }">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Ghost Button' }"
								[config]="{ variant: 'ghost' }">
							</ui-button>
						</div>
					</div>
				</div>
			</section>

			<!-- Badges Section -->
			<section class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Badge Components
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Status Badges</h3>
						<div class="space-y-2">
							@for (color of badgeColors(); track color) {
								<ui-badge 
									[data]="{ text: color + ' Status' }"
									[config]="{ variant: 'status', color: color, showDot: true }">
								</ui-badge>
							}
						</div>
					</div>
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Tech Badges</h3>
						<div class="flex flex-wrap gap-2">
							@for (tech of techStack(); track tech) {
								<ui-badge 
									[data]="{ text: tech }"
									[config]="{ variant: 'tech', color: 'gray' }">
								</ui-badge>
							}
						</div>
					</div>
					<div class="space-y-4">
						<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Animated Badges</h3>
						<div class="space-y-2">
							<ui-badge 
								[data]="{ text: 'Live Status', icon: '🟢' }"
								[config]="{ variant: 'status', color: 'green', showDot: true, animate: true }">
							</ui-badge>
							<ui-badge 
								[data]="{ text: 'Processing', icon: '⚡' }"
								[config]="{ variant: 'status', color: 'yellow', showDot: true, animate: true }">
							</ui-badge>
						</div>
					</div>
				</div>
			</section>

			<!-- Cards Section -->
			<section class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Card Components
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					@for (card of sampleCards(); track card.title) {
						<ui-card 
							[data]="card"
							[config]="{ variant: 'feature', hoverable: true }">
						</ui-card>
					}
				</div>
			</section>

			<!-- Tech Stack Items Section -->
			<section class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Tech Stack Items
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					@for (item of techStackItems(); track item.name) {
						<ui-tech-stack-item [data]="item"></ui-tech-stack-item>
					}
				</div>
			</section>

			<!-- Code Windows Section -->
			<section class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Code Window Components
				</h2>
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<ui-code-window 
						[data]="codeExample()"
						[config]="{ variant: 'code' }">
					</ui-code-window>
					<ui-code-window 
						[data]="terminalExample()"
						[config]="{ variant: 'terminal' }">
					</ui-code-window>
				</div>
			</section>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentShowcaseComponent {
	badgeColors = signal(['blue', 'green', 'purple', 'red', 'yellow', 'gray'] as const);
	
	techStack = signal([
		'Angular 18+',
		'TypeScript',
		'Tailwind CSS',
		'Nx Monorepo',
		'Signals',
		'Standalone Components'
	]);

	sampleCards = signal([
		{
			icon: '⚡',
			title: 'High Performance',
			description: 'Optimized for speed with OnPush change detection and modern Angular features.',
			gradient: 'from-blue-500 to-purple-600'
		},
		{
			icon: '🎨',
			title: 'Beautiful Design',
			description: 'Tailwind CSS powered components with dark mode support and smooth animations.',
			gradient: 'from-green-500 to-blue-500'
		},
		{
			icon: '🔧',
			title: 'Developer Friendly',
			description: 'TypeScript strict mode, comprehensive interfaces, and AI-optimized patterns.',
			gradient: 'from-purple-500 to-pink-500'
		}
	]);

	techStackItems = signal([
		{
			name: 'Angular 18+',
			description: 'Modern framework with signals and standalone components',
			icon: 'A',
			gradient: 'from-red-500 to-red-600'
		},
		{
			name: 'TypeScript',
			description: 'Strict typing for better development experience',
			icon: 'TS',
			gradient: 'from-blue-500 to-blue-600'
		},
		{
			name: 'Tailwind CSS',
			description: 'Utility-first CSS for rapid UI development',
			icon: 'TW',
			gradient: 'from-cyan-500 to-blue-500'
		},
		{
			name: 'Nx Monorepo',
			description: 'Scalable development tools and architecture',
			icon: 'NX',
			gradient: 'from-purple-500 to-purple-600'
		}
	]);

	codeExample = signal({
		title: 'Modern Angular Component',
		lines: [
			{ type: 'comment' as const, content: '// Modern Angular with signals' },
			{ type: 'keyword' as const, content: 'const count = signal(0);' },
			{ type: 'variable' as const, content: 'const doubled = computed(() => count() * 2);' },
			{ type: 'normal' as const, content: '' },
			{ type: 'comment' as const, content: '// New control flow syntax' },
			{ type: 'string' as const, content: '@if (count() > 0) {' },
			{ type: 'normal' as const, content: 'Count is: {{ count() }}', indent: 1 },
			{ type: 'string' as const, content: '}' }
		]
	});

	terminalExample = signal({
		title: 'Setup Commands',
		lines: [
			{ type: 'comment' as const, content: '# Install dependencies' },
			{ type: 'normal' as const, content: 'npm install' },
			{ type: 'normal' as const, content: '' },
			{ type: 'comment' as const, content: '# Start development server' },
			{ type: 'normal' as const, content: 'npx nx serve ui' },
			{ type: 'normal' as const, content: '' },
			{ type: 'comment' as const, content: '# Build for production' },
			{ type: 'normal' as const, content: 'npx nx build ui --prod' }
		]
	});
}
