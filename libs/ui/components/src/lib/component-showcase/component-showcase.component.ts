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
		class: 'block bg-gray-50 dark:bg-gray-900 min-h-screen'
	},
	template: `
		<!-- Hero Section with Navigation -->
		<div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-8">
			<div class="max-w-6xl mx-auto">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-6">
						<div class="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
							<span class="text-3xl">🎨</span>
						</div>
						<h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Component Showcase
						</h1>
					</div>
					<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						A comprehensive demonstration of all reusable UI components built with Angular 18+, 
						Tailwind CSS, and modern development patterns
					</p>
				</div>
				
				<!-- Quick Navigation -->
				<div class="flex flex-wrap justify-center gap-3 mb-8">
					@for (section of navigationSections(); track section.id) {
						<a 
							[href]="'#' + section.id"
							class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg 
								   shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 
								   border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
							{{ section.label }}
						</a>
					}
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="max-w-7xl mx-auto px-8 py-16 space-y-20">

			<!-- Buttons Section -->
			<section id="buttons" class="scroll-mt-24">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-4">
						<span class="text-2xl">🎯</span>
						<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Button Components
						</h2>
					</div>
					<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						Interactive buttons with multiple variants, sizes, and states for every use case
					</p>
				</div>
				
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Primary Buttons Column -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Primary Actions</h3>
						</div>
						<div class="space-y-4">
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

					<!-- Secondary Buttons Column -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-3 h-3 bg-gray-500 rounded-full"></div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Secondary Actions</h3>
						</div>
						<div class="space-y-4">
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

					<!-- Special States Column -->
					<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-3 h-3 bg-purple-500 rounded-full"></div>
							<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Special States</h3>
						</div>
						<div class="space-y-4">
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
			<section id="badges" class="scroll-mt-24">
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
							@for (color of badgeColors(); track color) {
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
			</section>

			<!-- Cards Section -->
			<section id="cards" class="scroll-mt-24">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-4">
						<span class="text-2xl">📋</span>
						<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Card Components
						</h2>
					</div>
					<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						Flexible card layouts for showcasing features, content, and information
					</p>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					@for (card of sampleCards(); track card.title) {
						<div class="transform transition-all duration-300 hover:scale-105">
							<ui-card 
								[data]="card"
								[config]="{ variant: 'feature', hoverable: true }">
							</ui-card>
						</div>
					}
				</div>
				
				<!-- Additional Card Showcase -->
				<div class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
					<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						Interactive Card States
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
							<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Hover Effects</h4>
							<p class="text-gray-600 dark:text-gray-400 text-sm">Cards respond to user interaction with smooth animations</p>
						</div>
						<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
							<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Responsive Design</h4>
							<p class="text-gray-600 dark:text-gray-400 text-sm">Adapts beautifully across all screen sizes</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Tech Stack Items Section -->
			<section id="tech-stack" class="scroll-mt-24">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-4">
						<span class="text-2xl">⚡</span>
						<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Tech Stack Items
						</h2>
					</div>
					<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						Showcase your technology stack with beautiful, informative components
					</p>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					@for (item of techStackItems(); track item.name) {
						<div class="transform transition-all duration-300 hover:scale-102">
							<ui-tech-stack-item [data]="item"></ui-tech-stack-item>
						</div>
					}
				</div>
				
				<!-- Tech Stack Overview -->
				<div class="mt-16 text-center">
					<div class="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl px-8 py-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div class="flex -space-x-2">
							@for (item of techStackItems(); track item.name) {
								<div class="w-10 h-10 rounded-full bg-gradient-to-r {{ item.gradient }} flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800">
									{{ item.icon }}
								</div>
							}
						</div>
						<div class="text-left">
							<p class="font-semibold text-gray-900 dark:text-gray-100">Modern Stack</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">Built with cutting-edge technologies</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Code Windows Section -->
			<section id="code-windows" class="scroll-mt-24">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-4">
						<span class="text-2xl">💻</span>
						<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Code Window Components
						</h2>
					</div>
					<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						Elegant code display windows with syntax highlighting and terminal emulation
					</p>
				</div>
				
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div class="transform transition-all duration-300 hover:scale-102">
						<ui-code-window 
							[data]="codeExample()"
							[config]="{ variant: 'code' }">
						</ui-code-window>
					</div>
					<div class="transform transition-all duration-300 hover:scale-102">
						<ui-code-window 
							[data]="terminalExample()"
							[config]="{ variant: 'terminal' }">
						</ui-code-window>
					</div>
				</div>
				
				<!-- Code Features Highlight -->
				<div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-blue-600 dark:text-blue-400 text-xl">🎨</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Syntax Highlighting</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Beautiful color-coded syntax for better readability</p>
					</div>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-green-600 dark:text-green-400 text-xl">📱</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Responsive Design</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Adapts perfectly to any screen size</p>
					</div>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-purple-600 dark:text-purple-400 text-xl">⚡</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Performance</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Optimized for smooth interactions</p>
					</div>
				</div>
			</section>
		</div>

		<!-- Footer Section -->
		<div class="bg-gray-100 dark:bg-gray-800 py-16 px-8 mt-20">
			<div class="max-w-4xl mx-auto text-center">
				<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					Ready to Build Something Amazing?
				</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
					These components are built with modern Angular patterns, TypeScript strict mode, 
					and designed for scalability in enterprise applications.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<ui-button 
						[data]="{ text: 'View Documentation', icon: '📚' }"
						[config]="{ variant: 'primary', size: 'lg' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'GitHub Repository', icon: '⭐' }"
						[config]="{ variant: 'secondary', size: 'lg' }">
					</ui-button>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentShowcaseComponent {
	navigationSections = signal([
		{ id: 'buttons', label: '🎯 Buttons' },
		{ id: 'badges', label: '🏷️ Badges' },
		{ id: 'cards', label: '📋 Cards' },
		{ id: 'tech-stack', label: '⚡ Tech Stack' },
		{ id: 'code-windows', label: '💻 Code Windows' }
	]);

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
