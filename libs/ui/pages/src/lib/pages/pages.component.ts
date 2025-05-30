import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '@ai-optimized-angular-template/services';
import { 
	ThemeToggleComponent,
	ButtonComponent,
	CardComponent,
	CodeWindowComponent,
	BadgeComponent,
	TechStackItemComponent
} from '@ui/components';

@Component({
	selector: 'lib-pages',
	imports: [
		ThemeToggleComponent,
		ButtonComponent,
		CardComponent,
		CodeWindowComponent,
		BadgeComponent,
		TechStackItemComponent
	],
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
						<ui-badge 
							[data]="{ text: 'Production Ready Template' }"
							[config]="{ variant: 'status', color: 'blue', showDot: true, animate: true }"
							class="mb-6 animate-fade-in">
						</ui-badge>
						
						<h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 animate-fade-in">
							AI-Optimized Angular Template
						</h1>
						
						<p class="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed animate-fade-in">
							The ultimate full-stack development starter with <strong>Angular 18+</strong>, <strong>NestJS</strong>, and <strong>AI-first tooling</strong>. 
							Built for developers who want to ship fast and code with intelligence.
						</p>
						
						<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
							<ui-button 
								[data]="{ text: 'Explore Features' }"
								[config]="{ variant: 'primary', size: 'lg' }"
								(click)="scrollToSection('features')">
							</ui-button>
							<ui-button 
								[data]="{ text: 'View Components', icon: '🎨' }"
								[config]="{ variant: 'secondary', size: 'lg' }"
								(click)="navigateToShowcase()">
							</ui-button>
							<ui-button 
								[data]="{ text: 'File Management', icon: '📁' }"
								[config]="{ variant: 'secondary', size: 'lg' }"
								(click)="navigateToFiles()">
							</ui-button>
							<ui-button 
								[data]="{ text: 'Tech Stack' }"
								[config]="{ variant: 'ghost', size: 'lg' }"
								(click)="scrollToSection('stack')">
							</ui-button>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm text-slate-600 dark:text-slate-400 animate-fade-in">
							<ui-badge 
								[data]="{ text: 'TypeScript Strict Mode' }"
								[config]="{ variant: 'feature', color: 'green', showDot: true }"
								class="justify-center">
							</ui-badge>
							<ui-badge 
								[data]="{ text: 'Modern Angular Signals' }"
								[config]="{ variant: 'feature', color: 'blue', showDot: true }"
								class="justify-center">
							</ui-badge>
							<ui-badge 
								[data]="{ text: 'AI-Enhanced Development' }"
								[config]="{ variant: 'feature', color: 'purple', showDot: true }"
								class="justify-center">
							</ui-badge>
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
							<ui-card 
								[data]="{ 
									icon: feature.icon, 
									title: feature.title, 
									description: feature.description,
									gradient: feature.gradient
								}"
								[config]="{ variant: 'feature', hoverable: true }">
							</ui-card>
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
								<ui-tech-stack-item 
									[data]="{ 
										name: tech.name, 
										description: tech.description,
										icon: tech.icon,
										gradient: tech.gradient
									}">
								</ui-tech-stack-item>
							}
						</div>

						<!-- Backend Stack -->
						<div class="space-y-6">
							<h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
								<span class="w-3 h-3 bg-green-500 rounded-full"></span>
								Backend Stack
							</h3>
							@for (tech of backendStack(); track tech.name) {
								<ui-tech-stack-item 
									[data]="{ 
										name: tech.name, 
										description: tech.description,
										icon: tech.icon,
										gradient: tech.gradient
									}">
								</ui-tech-stack-item>
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
							<ui-code-window 
								[data]="aiCodeExample()"
								[config]="{ variant: 'code' }">
							</ui-code-window>
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
						<ui-code-window 
							[data]="terminalExample()"
							[config]="{ variant: 'terminal' }"
							class="mb-8">
						</ui-code-window>

						<div class="text-center">
							<p class="text-slate-400 mb-6">
								Built with ❤️ for the AI-enhanced development era
							</p>
							<div class="flex flex-wrap justify-center gap-4 text-sm">
								@for (tech of techBadges(); track tech) {
									<ui-badge 
										[data]="{ text: tech }"
										[config]="{ variant: 'tech', color: 'gray' }">
									</ui-badge>
								}
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
	private router = inject(Router);
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

	aiCodeExample = signal({
		title: 'AI Assistant Ready',
		lines: [
			{ type: 'comment' as const, content: '// ✨ AI can understand this structure instantly' },
			{ type: 'keyword' as const, content: 'const userSignal = signal<User | null>(null);' },
			{ type: 'variable' as const, content: 'const isLoading = computed(() => !userSignal());' },
			{ type: 'normal' as const, content: '' },
			{ type: 'comment' as const, content: '// 🎯 Type-safe, modern patterns' },
			{ type: 'string' as const, content: '@if (userSignal(); as user) {' },
			{ type: 'normal' as const, content: 'Welcome back, user.name!', indent: 1 },
			{ type: 'string' as const, content: '}' }
		]
	});

	terminalExample = signal({
		title: 'Terminal',
		lines: [
			{ type: 'comment' as const, content: '# Clone and setup' },
			{ type: 'normal' as const, content: 'git clone <your-repo>' },
			{ type: 'normal' as const, content: 'cd ai-optimized-angular-template' },
			{ type: 'normal' as const, content: 'npm install' },
			{ type: 'normal' as const, content: '' },
			{ type: 'comment' as const, content: '# Start development' },
			{ type: 'normal' as const, content: 'npx nx serve ui  # Frontend on :4200' },
			{ type: 'normal' as const, content: 'npx nx serve api # Backend on :3000' }
		]
	});

	techBadges = signal([
		'Angular 18+',
		'NestJS',
		'Nx Monorepo',
		'Tailwind CSS',
		'Prisma ORM',
		'TypeScript'
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

	navigateToShowcase(): void {
		this.router.navigate(['/showcase']);
	}

	navigateToFiles(): void {
		this.router.navigate(['/files']);
	}
}
