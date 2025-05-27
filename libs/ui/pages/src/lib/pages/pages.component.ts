import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '@ai-optimized-angular-template/services';
import { ThemeToggleComponent } from '@ai-optimized-angular-template/components';

@Component({
	selector: 'lib-pages',
	imports: [ThemeToggleComponent],
	template: `
		<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
			<!-- Theme Toggle - Fixed Position -->
			<div class="fixed top-6 right-6 z-50">
				<ui-theme-toggle></ui-theme-toggle>
			</div>
			
			<!-- Hero Section -->
			<header class="relative overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
				<div class="relative container mx-auto px-6 py-16 md:py-24">
					<div class="text-center max-w-4xl mx-auto">
						<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-fade-in">
							<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
							Production Ready Template
						</div>
						
						<h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 animate-fade-in">
							AI-Optimized Angular Template
						</h1>
						
						<p class="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed animate-fade-in">
							The ultimate full-stack development starter with <strong>Angular 18+</strong>, <strong>NestJS</strong>, and <strong>AI-first tooling</strong>. 
							Built for developers who want to ship fast and code with intelligence.
						</p>
						
						<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
							<button 
								(click)="scrollToSection('features')"
								class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-out">
								Explore Features
							</button>
							<button 
								(click)="scrollToSection('stack')"
								class="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
								View Tech Stack
							</button>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm text-slate-600 dark:text-slate-400 animate-fade-in">
							<div class="flex items-center justify-center gap-2">
								<span class="w-2 h-2 bg-green-500 rounded-full"></span>
								TypeScript Strict Mode
							</div>
							<div class="flex items-center justify-center gap-2">
								<span class="w-2 h-2 bg-blue-500 rounded-full"></span>
								Modern Angular Signals
							</div>
							<div class="flex items-center justify-center gap-2">
								<span class="w-2 h-2 bg-purple-500 rounded-full"></span>
								AI-Enhanced Development
							</div>
						</div>
					</div>
				</div>
			</header>

			<!-- Features Section -->
			<section id="features" class="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
				<div class="container mx-auto px-6">
					<div class="text-center mb-16">
						<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
							Why Choose This Template?
						</h2>
						<p class="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
							Built with modern best practices and AI-first development in mind. Get productive immediately with zero configuration.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						@for (feature of features(); track feature.title) {
							<div class="group p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-700">
								<div class="w-12 h-12 bg-gradient-to-br {{ feature.gradient }} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
									<span class="text-2xl">{{ feature.icon }}</span>
								</div>
								<h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{{ feature.title }}</h3>
								<p class="text-slate-600 dark:text-slate-300 leading-relaxed">{{ feature.description }}</p>
							</div>
						}
					</div>
				</div>
			</section>

			<!-- Tech Stack Section -->
			<section id="stack" class="py-20">
				<div class="container mx-auto px-6">
					<div class="text-center mb-16">
						<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
							Modern Tech Stack
						</h2>
						<p class="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
							Carefully selected technologies that work together seamlessly for maximum developer productivity.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
						<!-- Frontend Stack -->
						<div class="space-y-6">
							<h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
								<span class="w-3 h-3 bg-blue-500 rounded-full"></span>
								Frontend Stack
							</h3>
							@for (tech of frontendStack(); track tech.name) {
								<div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
									<div class="w-10 h-10 bg-gradient-to-br {{ tech.gradient }} rounded-lg flex items-center justify-center text-white font-bold">
										{{ tech.icon }}
									</div>
									<div>
										<h4 class="font-semibold text-slate-900 dark:text-slate-100">{{ tech.name }}</h4>
										<p class="text-sm text-slate-600 dark:text-slate-400">{{ tech.description }}</p>
									</div>
								</div>
							}
						</div>

						<!-- Backend Stack -->
						<div class="space-y-6">
							<h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
								<span class="w-3 h-3 bg-green-500 rounded-full"></span>
								Backend Stack
							</h3>
							@for (tech of backendStack(); track tech.name) {
								<div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
									<div class="w-10 h-10 bg-gradient-to-br {{ tech.gradient }} rounded-lg flex items-center justify-center text-white font-bold">
										{{ tech.icon }}
									</div>
									<div>
										<h4 class="font-semibold text-slate-900 dark:text-slate-100">{{ tech.name }}</h4>
										<p class="text-sm text-slate-600 dark:text-slate-400">{{ tech.description }}</p>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</section>

			<!-- AI Features Section -->
			<section class="py-20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
				<div class="container mx-auto px-6">
					<div class="text-center mb-16">
						<h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
							🤖 AI-Enhanced Development
						</h2>
						<p class="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
							This template is optimized for AI-assisted development workflows, making it perfect for tools like GitHub Copilot, Cursor, and other AI coding assistants.
						</p>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
						<div class="space-y-6">
							@for (aiFeature of aiFeatures(); track aiFeature.title) {
								<div class="flex gap-4 p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
									<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
										{{ aiFeature.icon }}
									</div>
									<div>
										<h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{{ aiFeature.title }}</h3>
										<p class="text-slate-600 dark:text-slate-300">{{ aiFeature.description }}</p>
									</div>
								</div>
							}
						</div>

						<div class="relative">
							<div class="bg-slate-900 dark:bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl">
								<div class="flex items-center gap-2 mb-4">
									<div class="w-3 h-3 bg-red-500 rounded-full"></div>
									<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
									<div class="w-3 h-3 bg-green-500 rounded-full"></div>
									<span class="text-slate-400 text-sm ml-2">AI Assistant Ready</span>
								</div>
								<div class="space-y-2 text-sm font-mono">
									<div class="text-green-400">// ✨ AI can understand this structure instantly</div>
									<div class="text-blue-400">const userSignal = signal&lt;User | null&gt;(null);</div>
									<div class="text-purple-400">const isLoading = computed(() => !userSignal());</div>
									<div class="text-slate-300"></div>
									<div class="text-green-400">// 🎯 Type-safe, modern patterns</div>
									<div class="text-yellow-400">&#64;if (userSignal(); as user) &#123;</div>
									<div class="text-slate-300 ml-4">Welcome back, user.name!</div>
									<div class="text-yellow-400">&#125;</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Getting Started Section -->
			<section class="py-20 bg-slate-900 dark:bg-slate-950 text-white">
				<div class="container mx-auto px-6">
					<div class="text-center mb-16">
						<h2 class="text-4xl md:text-5xl font-bold mb-4">
							Ready to Build?
						</h2>
						<p class="text-xl text-slate-300 max-w-3xl mx-auto">
							Get started in minutes with our comprehensive development environment.
						</p>
					</div>

					<div class="max-w-4xl mx-auto">
						<div class="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
							<div class="flex items-center gap-2 mb-4">
								<div class="w-3 h-3 bg-red-500 rounded-full"></div>
								<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
								<div class="w-3 h-3 bg-green-500 rounded-full"></div>
								<span class="text-slate-400 text-sm ml-2">Terminal</span>
							</div>
							<div class="space-y-2 text-sm font-mono">
								<div class="text-green-400"># Clone and setup</div>
								<div class="text-slate-300">git clone &lt;your-repo&gt;</div>
								<div class="text-slate-300">cd ai-optimized-angular-template</div>
								<div class="text-slate-300">npm install</div>
								<div class="text-slate-300"></div>
								<div class="text-green-400"># Start development</div>
								<div class="text-slate-300">npx nx serve ui  <span class="text-slate-500"># Frontend on :4200</span></div>
								<div class="text-slate-300">npx nx serve api <span class="text-slate-500"># Backend on :3000</span></div>
							</div>
						</div>

						<div class="text-center">
							<p class="text-slate-400 mb-6">
								Built with ❤️ for the AI-enhanced development era
							</p>
							<div class="flex flex-wrap justify-center gap-4 text-sm">
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Angular 18+</span>
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">NestJS</span>
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Nx Monorepo</span>
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Tailwind CSS</span>
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Prisma ORM</span>
								<span class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">TypeScript</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	`,
	styles: `
		:host {
			display: block;
			width: 100%;
			min-height: 100vh;
		}

		/* Custom scrollbar for webkit browsers */
		:host ::ng-deep ::-webkit-scrollbar {
			width: 8px;
		}

		:host ::ng-deep ::-webkit-scrollbar-track {
			@apply bg-slate-100 dark:bg-slate-800;
		}

		:host ::ng-deep ::-webkit-scrollbar-thumb {
			@apply bg-slate-400 dark:bg-slate-600 rounded-full;
		}

		:host ::ng-deep ::-webkit-scrollbar-thumb:hover {
			@apply bg-slate-500 dark:bg-slate-500;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {
	private document = inject(DOCUMENT);
	protected themeService = inject(ThemeService);

	features = signal([
		{
			icon: '🚀',
			title: 'Zero Configuration',
			description: 'Start coding immediately with pre-configured build tools, linting, testing, and deployment pipelines.',
			gradient: 'from-blue-500 to-purple-600'
		},
		{
			icon: '⚡',
			title: 'Modern Angular',
			description: 'Built with Angular 18+ featuring signals, computed properties, new control flow, and standalone components.',
			gradient: 'from-green-500 to-blue-500'
		},
		{
			icon: '🧠',
			title: 'AI-Optimized',
			description: 'Structured for maximum AI assistant comprehension with clear patterns and comprehensive type definitions.',
			gradient: 'from-purple-500 to-pink-500'
		},
		{
			icon: '🏗️',
			title: 'Full-Stack Ready',
			description: 'Complete NestJS backend with authentication, validation, logging, rate limiting, and database integration.',
			gradient: 'from-orange-500 to-red-500'
		},
		{
			icon: '📱',
			title: 'Responsive Design',
			description: 'Beautiful, accessible UI components with Tailwind CSS, dark mode support, and mobile-first design.',
			gradient: 'from-teal-500 to-blue-500'
		},
		{
			icon: '🔧',
			title: 'Developer Experience',
			description: 'Hot reload, TypeScript strict mode, comprehensive testing setup, and integrated development tools.',
			gradient: 'from-indigo-500 to-purple-500'
		}
	]);

	frontendStack = signal([
		{
			name: 'Angular 18+',
			description: 'Latest Angular with signals and modern features',
			icon: 'A',
			gradient: 'from-red-500 to-red-600'
		},
		{
			name: 'TypeScript',
			description: 'Strict mode for maximum type safety',
			icon: 'TS',
			gradient: 'from-blue-500 to-blue-600'
		},
		{
			name: 'Tailwind CSS',
			description: 'Utility-first CSS framework',
			icon: 'T',
			gradient: 'from-cyan-500 to-blue-500'
		},
		{
			name: 'Nx Monorepo',
			description: 'Scalable development architecture',
			icon: 'NX',
			gradient: 'from-purple-500 to-purple-600'
		}
	]);

	backendStack = signal([
		{
			name: 'NestJS',
			description: 'Enterprise-grade Node.js framework',
			icon: 'N',
			gradient: 'from-red-500 to-pink-500'
		},
		{
			name: 'Prisma ORM',
			description: 'Type-safe database access',
			icon: 'P',
			gradient: 'from-green-500 to-green-600'
		},
		{
			name: 'PostgreSQL',
			description: 'Robust relational database',
			icon: 'PG',
			gradient: 'from-blue-600 to-blue-700'
		},
		{
			name: 'Swagger/OpenAPI',
			description: 'Auto-generated API documentation',
			icon: 'SW',
			gradient: 'from-orange-500 to-orange-600'
		}
	]);

	aiFeatures = signal([
		{
			icon: '🎯',
			title: 'Consistent Patterns',
			description: 'Standardized code patterns that AI tools can easily understand and replicate across your entire codebase.'
		},
		{
			icon: '📚',
			title: 'Rich Type Definitions',
			description: 'Comprehensive TypeScript interfaces and types that provide perfect context for AI-assisted development.'
		},
		{
			icon: '🔄',
			title: 'Predictable Structure',
			description: 'Well-organized file structure and naming conventions that AI can navigate and understand intuitively.'
		},
		{
			icon: '💡',
			title: 'Smart Defaults',
			description: 'Pre-configured settings and examples that serve as perfect starting points for AI-generated code.'
		}
	]);

	scrollToSection(sectionId: string): void {
		const element = this.document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ 
				behavior: 'smooth',
				block: 'start'
			});
		}
	}
}
