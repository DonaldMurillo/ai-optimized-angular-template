import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CardComponent, type CardData } from '@ui/components';

@Component({
	selector: 'ui-cards-showcase-widget',
	standalone: true,
	imports: [CardComponent],
	host: {
		class: 'block'
	},
	template: `
		<section class="scroll-mt-24">
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
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsShowcaseWidget {
	// Built-in sample data
	sampleCards = signal<CardData[]>([
		{
			title: 'Modern Design',
			description: 'Beautiful, clean interfaces that users love to interact with',
			icon: '✨'
		},
		{
			title: 'Performance',
			description: 'Lightning-fast applications built with the latest technologies',
			icon: '⚡'
		},
		{
			title: 'Accessibility',
			description: 'Inclusive design that works for everyone, everywhere',
			icon: '♿'
		},
		{
			title: 'Mobile First',
			description: 'Responsive designs that look perfect on any device',
			icon: '📱'
		},
		{
			title: 'Developer Tools',
			description: 'Powerful development experience with modern tooling',
			icon: '🛠️'
		},
		{
			title: 'Community',
			description: 'Join thousands of developers building amazing things',
			icon: '👥'
		}
	]);
}
