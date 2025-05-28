import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	HeroShowcaseWidget,
	ButtonsShowcaseWidget,
	BadgesShowcaseWidget,
	CardsShowcaseWidget,
	FormsShowcaseWidget,
	FeedbackShowcaseWidget,
	LayoutShowcaseWidget,
	TechStackShowcaseWidget,
	CodeWindowsShowcaseWidget
} from '@ui/widgets';

@Component({
	selector: 'lib-showcase-page',
	standalone: true,
	imports: [
		HeroShowcaseWidget,
		ButtonsShowcaseWidget,
		BadgesShowcaseWidget,
		CardsShowcaseWidget,
		FormsShowcaseWidget,
		FeedbackShowcaseWidget,
		LayoutShowcaseWidget,
		TechStackShowcaseWidget,
		CodeWindowsShowcaseWidget
	],
	host: {
		class: 'block bg-gray-50 dark:bg-gray-900 min-h-screen'
	},
	template: `
		<div class="relative">
			<!-- Hero Section -->
			<ui-hero-showcase-widget></ui-hero-showcase-widget>
			
			<!-- Main Content Container -->
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
				
				<!-- Layout Components Section -->
				<section id="layout">
					<ui-layout-showcase-widget></ui-layout-showcase-widget>
				</section>
				
				<!-- Buttons Section -->
				<section id="buttons">
					<ui-buttons-showcase-widget></ui-buttons-showcase-widget>
				</section>
				
				<!-- Cards Section -->
				<section id="cards">
					<ui-cards-showcase-widget></ui-cards-showcase-widget>
				</section>
				
				<!-- Badges Section -->
				<section id="badges">
					<ui-badges-showcase-widget></ui-badges-showcase-widget>
				</section>
				
				<!-- Forms Section -->
				<section id="forms">
					<ui-forms-showcase-widget></ui-forms-showcase-widget>
				</section>
				
				<!-- Feedback Section -->
				<section id="feedback">
					<ui-feedback-showcase-widget></ui-feedback-showcase-widget>
				</section>
				
				<!-- Tech Stack Section -->
				<section id="tech-stack">
					<ui-tech-stack-showcase-widget></ui-tech-stack-showcase-widget>
				</section>
				
				<!-- Code Examples Section -->
				<section id="code-windows">
					<ui-code-windows-showcase-widget></ui-code-windows-showcase-widget>
				</section>
				
			</div>
			
			<!-- Footer -->
			<footer class="mt-24 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div class="text-center">
						<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							Modern UI Component Library
						</h3>
						<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
							Built with Angular 18+, Signals, TypeScript, and Tailwind CSS. 
							Featuring responsive design, dark mode support, and accessibility-first components.
						</p>
						<div class="flex flex-wrap justify-center gap-4">
							<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
								<span>Angular 18+</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
								<span>TypeScript</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
								<span>Tailwind CSS</span>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
								<span>Nx Monorepo</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcasePageComponent {

}
