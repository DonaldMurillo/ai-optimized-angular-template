import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonComponent } from '@ui/components';

@Component({
	selector: 'ui-buttons-showcase-widget',
	standalone: true,
	imports: [ButtonComponent],
	host: {
		class: 'block'
	},
	template: `
		<section class="scroll-mt-24">
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

			<!-- Button Grid Showcase -->
			<div class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
				<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
					Available Button Variants
				</h3>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					<ui-button 
						[data]="{ text: 'Primary' }"
						[config]="{ variant: 'primary', size: 'md' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'Secondary' }"
						[config]="{ variant: 'secondary', size: 'md' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'Ghost' }"
						[config]="{ variant: 'ghost', size: 'md' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'Success', icon: '✓' }"
						[config]="{ variant: 'primary', size: 'md' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'Danger', icon: '⚠' }"
						[config]="{ variant: 'secondary', size: 'md' }">
					</ui-button>
					<ui-button 
						[data]="{ text: 'Disabled' }"
						[config]="{ variant: 'primary', size: 'md', disabled: true }">
					</ui-button>
				</div>
			</div>
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsShowcaseWidget {
	// No inputs needed - this widget is completely self-contained
}
