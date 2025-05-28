import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface NavigationSection {
	id: string;
	label: string;
}

@Component({
	selector: 'ui-hero-showcase-widget',
	standalone: true,
	imports: [],
	host: {
		class: 'block'
	},
	template: `
		<div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-8">
			<div class="max-w-6xl mx-auto">
				<div class="text-center mb-12">
					<div class="inline-flex items-center gap-3 mb-6">
						<div class="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
							<span class="text-3xl">🎨</span>
						</div>
						<h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{{ heroData().title }}
						</h1>
					</div>
					<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						{{ heroData().subtitle }}
					</p>
				</div>
				
				<!-- Quick Navigation -->
				<div class="flex flex-wrap justify-center gap-3 mb-8">
					@for (section of heroData().navigationSections; track section.id) {
						<button 
							(click)="onNavigationClick(section)"
							class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg 
								   shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 
								   border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
							{{ section.label }}
						</button>
					}
				</div>

				<!-- Interactive Demo Section -->
				<div class="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
						Interactive Hero Components
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						@for (feature of heroFeatures(); track feature.title) {
							<div class="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
								<div class="text-3xl mb-4">{{ feature.icon }}</div>
								<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ feature.title }}</h3>
								<p class="text-gray-600 dark:text-gray-300 text-sm">{{ feature.description }}</p>
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroShowcaseWidget {
	// Built-in hero data
	heroData = signal({
		title: 'Modern UI Components',
		subtitle: 'Beautiful, accessible, and performant components built with Angular and Tailwind CSS. Perfect for creating stunning user interfaces.',
		navigationSections: [
			{ id: 'layout', label: 'Layout' },
			{ id: 'buttons', label: 'Buttons' },
			{ id: 'cards', label: 'Cards' },
			{ id: 'forms', label: 'Forms' },
			{ id: 'feedback', label: 'Feedback' },
			{ id: 'badges', label: 'Badges' },
			{ id: 'tech-stack', label: 'Tech Stack' },
			{ id: 'code-windows', label: 'Code Examples' }
		]
	});

	// Built-in feature showcase data
	heroFeatures = signal([
		{
			icon: '⚡',
			title: 'Lightning Fast',
			description: 'Optimized for performance with Angular signals and OnPush change detection'
		},
		{
			icon: '🎨',
			title: 'Beautiful Design',
			description: 'Modern, clean interfaces with dark mode support and smooth animations'
		},
		{
			icon: '📱',
			title: 'Fully Responsive',
			description: 'Components that look perfect on desktop, tablet, and mobile devices'
		},
		{
			icon: '♿',
			title: 'Accessible',
			description: 'Built with accessibility in mind, following WCAG guidelines'
		},
		{
			icon: '🔧',
			title: 'Highly Configurable',
			description: 'Flexible components with extensive customization options'
		},
		{
			icon: '🚀',
			title: 'Production Ready',
			description: 'Battle-tested components used in real-world applications'
		}
	]);

	onNavigationClick(section: NavigationSection): void {
		// Scroll to section (could be enhanced with smooth scrolling)
		const element = document.getElementById(section.id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
}
