import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { TechStackItemComponent } from '@ui/components';

export interface TechStackItem {
	name: string;
	description: string;
	icon: string;
	gradient: string;
	version?: string;
	category?: string;
	features?: string[];
}

export interface TechStackShowcaseData {
	items: TechStackItem[];
	categories?: Array<{
		name: string;
		items: TechStackItem[];
	}>;
}

export interface TechStackShowcaseConfig {
	variant: 'grid' | 'list' | 'categories';
	showOverview: boolean;
	enableHover: boolean;
	columns: 1 | 2 | 3 | 4;
}

export interface TechStackInteractionEvent {
	type: 'click' | 'hover';
	item: TechStackItem;
}

@Component({
	selector: 'ui-tech-stack-showcase-widget',
	standalone: true,
	imports: [TechStackItemComponent],
	host: {
		class: 'block'
	},
	template: `
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

			<!-- Demo Controls -->
			<div class="flex flex-wrap gap-4 justify-center mb-8">
				<button 
					(click)="setVariant('grid')"
					[class]="getButtonClasses('grid')"
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
					Grid View
				</button>
				<button 
					(click)="setVariant('categories')"
					[class]="getButtonClasses('categories')"
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
					Categories View
				</button>
				<button 
					(click)="toggleOverview()"
					[class]="config().showOverview ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'"
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
					{{ config().showOverview ? '✓' : '○' }} Overview
				</button>
				<button 
					(click)="toggleHover()"
					[class]="config().enableHover ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'"
					class="px-4 py-2 rounded-lg font-medium transition-all duration-200">
					{{ config().enableHover ? '✓' : '○' }} Hover Effects
				</button>
			</div>
			
			@if (config().variant === 'categories' && data().categories) {
				<!-- Categories Layout -->
				<div class="space-y-12">
					@for (category of data().categories; track category.name) {
						<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
							<div class="flex items-center gap-3 mb-6">
								<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
								<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">{{ category.name }}</h3>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								@for (item of category.items; track item.name) {
									<div 
										class="transform transition-all duration-300"
										[class.hover:scale-105]="config().enableHover"
										(click)="handleItemClick(item)"
										(mouseenter)="handleItemHover(item)">
										<ui-tech-stack-item [data]="item"></ui-tech-stack-item>
									</div>
								}
							</div>
						</div>
					}
				</div>
			} @else {
				<!-- Grid/List Layout -->
				<div 
					class="grid gap-6"
					[class]="getGridClasses()">
					@for (item of data().items; track item.name) {
						<div 
							class="transform transition-all duration-300"
							[class.hover:scale-105]="config().enableHover"
							(click)="handleItemClick(item)"
							(mouseenter)="handleItemHover(item)">
							<ui-tech-stack-item [data]="item"></ui-tech-stack-item>
						</div>
					}
				</div>
			}
			
			<!-- Tech Stack Overview -->
			@if (config().showOverview) {
				<div class="mt-16 text-center">
					<div class="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl px-8 py-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div class="flex -space-x-2">
							@for (item of getOverviewItems(); track item.name) {
								<div
									class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800"
									[class]="'bg-gradient-to-r ' + item.gradient"
									[title]="item.name">
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
			}

			<!-- Additional Tech Stack Information -->
			@if (config().variant !== 'categories') {
				<div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-blue-600 dark:text-blue-400 text-xl">🚀</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Performance</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Optimized for speed and efficiency with modern tooling</p>
					</div>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-green-600 dark:text-green-400 text-xl">🔧</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Developer Experience</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Type-safe development with excellent tooling support</p>
					</div>
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
						<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
							<span class="text-purple-600 dark:text-purple-400 text-xl">🌟</span>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Modern Standards</h4>
						<p class="text-gray-600 dark:text-gray-400 text-sm">Following current best practices and industry standards</p>
					</div>
				</div>
			}

			<!-- Technology Statistics -->
			@if (data().items.length > 0) {
				<div class="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
					<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
						Technology Stack Statistics
					</h3>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
						<div class="text-center">
							<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ getTotalTechnologies() }}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">Technologies</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ getFrameworkCount() }}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">Frameworks</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ getToolCount() }}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">Tools</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ getLanguageCount() }}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">Languages</div>
						</div>
					</div>
				</div>
			}

			<!-- Interaction Log -->
			@if (lastInteraction()) {
				<div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<div class="flex items-center gap-2 text-blue-800 dark:text-blue-200">
						<span class="text-lg">{{ lastInteraction()!.type === 'click' ? '👆' : '👋' }}</span>
						<span class="font-medium">
							{{ lastInteraction()!.type === 'click' ? 'Clicked' : 'Hovered' }} on {{ lastInteraction()!.item.name }}
						</span>
					</div>
					<p class="text-sm text-blue-600 dark:text-blue-400 mt-1">{{ lastInteraction()!.item.description }}</p>
				</div>
			}
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechStackShowcaseWidget {
	// Internal signals for self-contained demo
	data = signal<TechStackShowcaseData>({
		items: [
			{
				name: 'Angular',
				description: 'Modern web framework for building scalable applications',
				icon: '🅰️',
				gradient: 'from-red-500 to-pink-500',
				version: '18.0',
				category: 'Framework',
				features: ['Signals', 'Standalone Components', 'Control Flow']
			},
			{
				name: 'TypeScript',
				description: 'Strongly typed programming language that builds on JavaScript',
				icon: 'TS',
				gradient: 'from-blue-500 to-indigo-500',
				version: '5.0',
				category: 'Language',
				features: ['Type Safety', 'IntelliSense', 'Modern Features']
			},
			{
				name: 'Nx',
				description: 'Extensible dev tools for monorepos and large-scale development',
				icon: '🧊',
				gradient: 'from-indigo-500 to-purple-500',
				version: '18.0',
				category: 'Tool',
				features: ['Monorepo', 'Code Generation', 'Build Optimization']
			},
			{
				name: 'Tailwind CSS',
				description: 'Utility-first CSS framework for rapid UI development',
				icon: '💨',
				gradient: 'from-cyan-500 to-blue-500',
				version: '3.4',
				category: 'Framework',
				features: ['Utility Classes', 'Dark Mode', 'Responsive Design']
			},
			{
				name: 'Vite',
				description: 'Next generation frontend tooling for modern web development',
				icon: '⚡',
				gradient: 'from-yellow-500 to-orange-500',
				version: '5.0',
				category: 'Tool',
				features: ['Fast HMR', 'ES Modules', 'Plugin Ecosystem']
			},
			{
				name: 'ESLint',
				description: 'Find and fix problems in your JavaScript code',
				icon: '🔍',
				gradient: 'from-purple-500 to-pink-500',
				version: '8.0',
				category: 'Tool',
				features: ['Code Quality', 'Auto Fix', 'Custom Rules']
			},
			{
				name: 'Jest',
				description: 'Delightful JavaScript testing framework with focus on simplicity',
				icon: '🃏',
				gradient: 'from-green-500 to-emerald-500',
				version: '29.0',
				category: 'Tool',
				features: ['Zero Config', 'Snapshot Testing', 'Mocking']
			},
			{
				name: 'RxJS',
				description: 'Reactive Extensions Library for JavaScript',
				icon: '🔄',
				gradient: 'from-pink-500 to-rose-500',
				version: '7.0',
				category: 'Library',
				features: ['Observables', 'Operators', 'Reactive Programming']
			}
		],
		categories: [
			{
				name: 'Frontend Frameworks',
				items: [
					{
						name: 'Angular',
						description: 'Modern web framework for building scalable applications',
						icon: '🅰️',
						gradient: 'from-red-500 to-pink-500',
						version: '18.0',
						category: 'Framework'
					},
					{
						name: 'Tailwind CSS',
						description: 'Utility-first CSS framework for rapid UI development',
						icon: '💨',
						gradient: 'from-cyan-500 to-blue-500',
						version: '3.4',
						category: 'Framework'
					}
				]
			},
			{
				name: 'Development Tools',
				items: [
					{
						name: 'Nx',
						description: 'Extensible dev tools for monorepos',
						icon: '🧊',
						gradient: 'from-indigo-500 to-purple-500',
						version: '18.0',
						category: 'Tool'
					},
					{
						name: 'Vite',
						description: 'Next generation frontend tooling',
						icon: '⚡',
						gradient: 'from-yellow-500 to-orange-500',
						version: '5.0',
						category: 'Tool'
					}
				]
			},
			{
				name: 'Languages & Libraries',
				items: [
					{
						name: 'TypeScript',
						description: 'Strongly typed programming language',
						icon: 'TS',
						gradient: 'from-blue-500 to-indigo-500',
						version: '5.0',
						category: 'Language'
					},
					{
						name: 'RxJS',
						description: 'Reactive Extensions Library for JavaScript',
						icon: '🔄',
						gradient: 'from-pink-500 to-rose-500',
						version: '7.0',
						category: 'Library'
					}
				]
			}
		]
	});

	config = signal<TechStackShowcaseConfig>({
		variant: 'grid',
		showOverview: true,
		enableHover: true,
		columns: 2
	});

	lastInteraction = signal<TechStackInteractionEvent | null>(null);

	// Demo control methods
	setVariant(variant: 'grid' | 'list' | 'categories'): void {
		this.config.update(config => ({ ...config, variant }));
	}

	toggleOverview(): void {
		this.config.update(config => ({ ...config, showOverview: !config.showOverview }));
	}

	toggleHover(): void {
		this.config.update(config => ({ ...config, enableHover: !config.enableHover }));
	}

	getButtonClasses(variant: string): string {
		const isActive = this.config().variant === variant;
		return isActive 
			? 'bg-blue-500 text-white' 
			: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500';
	}

	getGridClasses(): string {
		const baseClasses = 'grid gap-6';
		const columnClasses = {
			1: 'grid-cols-1',
			2: 'grid-cols-1 md:grid-cols-2',
			3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
			4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
		};
		
		return `${baseClasses} ${columnClasses[this.config().columns]}`;
	}

	getOverviewItems(): TechStackItem[] {
		return this.data().items.slice(0, 6); // Show first 6 items in overview
	}

	getTotalTechnologies(): number {
		return this.data().items.length;
	}

	getFrameworkCount(): number {
		return this.data().items.filter((item: TechStackItem) => 
			item.category?.toLowerCase().includes('framework') || 
			item.name.toLowerCase().includes('angular') ||
			item.name.toLowerCase().includes('react') ||
			item.name.toLowerCase().includes('vue')
		).length;
	}

	getToolCount(): number {
		return this.data().items.filter((item: TechStackItem) => 
			item.category?.toLowerCase().includes('tool') || 
			item.name.toLowerCase().includes('nx') ||
			item.name.toLowerCase().includes('webpack') ||
			item.name.toLowerCase().includes('vite')
		).length;
	}

	getLanguageCount(): number {
		return this.data().items.filter((item: TechStackItem) => 
			item.category?.toLowerCase().includes('language') || 
			item.name.toLowerCase().includes('typescript') ||
			item.name.toLowerCase().includes('javascript') ||
			item.name.toLowerCase().includes('html') ||
			item.name.toLowerCase().includes('css')
		).length;
	}

	handleItemClick(item: TechStackItem): void {
		this.lastInteraction.set({ type: 'click', item });
	}

	handleItemHover(item: TechStackItem): void {
		if (this.config().enableHover) {
			this.lastInteraction.set({ type: 'hover', item });
		}
	}
} 
									