import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CodeWindowComponent } from '@ui/components';

export interface CodeLine {
	type: 'normal' | 'comment' | 'keyword' | 'string' | 'variable';
	content: string;
	indent?: number;
}

export interface CodeExample {
	title: string;
	lines: CodeLine[];
	language?: string;
}

export interface CodeWindowsShowcaseData {
	codeExample: CodeExample;
	terminalExample: CodeExample;
	additionalExamples?: CodeExample[];
}

export interface CodeWindowsShowcaseConfig {
	variant: 'side-by-side' | 'stacked' | 'tabs';
	showFeatures: boolean;
	enableCopy: boolean;
}

export interface CodeInteractionEvent {
	type: 'copy' | 'expand' | 'select';
	example: CodeExample;
	content?: string;
}

@Component({
	selector: 'ui-code-windows-showcase-widget',
	standalone: true,
	imports: [CodeWindowComponent],
	host: {
		class: 'block'
	},
	template: `
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

			<!-- Interactive Demo Controls -->
			<div class="mb-8 text-center">
				<div class="inline-flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300">Layout:</label>
					<select 
						(change)="onVariantChange($event)"
						[value]="config().variant"
						class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
						<option value="side-by-side">Side by Side</option>
						<option value="stacked">Stacked</option>
						<option value="tabs">Tabs</option>
					</select>
					<label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						<input 
							type="checkbox" 
							[checked]="config().showFeatures"
							(change)="toggleFeatures()"
							class="rounded border-gray-300 dark:border-gray-600">
						Show Features
					</label>
					<label class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						<input 
							type="checkbox" 
							[checked]="config().enableCopy"
							(change)="toggleCopy()"
							class="rounded border-gray-300 dark:border-gray-600">
						Enable Copy
					</label>
				</div>
			</div>
			
			@if (config().variant === 'side-by-side') {
				<!-- Side by Side Layout -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div class="transform transition-all duration-300 hover:scale-102">
						<ui-code-window 
							[data]="data().codeExample"
							[config]="{ variant: 'code' }">
						</ui-code-window>
					</div>
					<div class="transform transition-all duration-300 hover:scale-102">
						<ui-code-window 
							[data]="data().terminalExample"
							[config]="{ variant: 'terminal' }">
						</ui-code-window>
					</div>
				</div>
			} @else if (config().variant === 'stacked') {
				<!-- Stacked Layout -->
				<div class="space-y-8">
					<div class="transform transition-all duration-300 hover:scale-105">
						<ui-code-window 
							[data]="data().codeExample"
							[config]="{ variant: 'code' }">
						</ui-code-window>
					</div>
					<div class="transform transition-all duration-300 hover:scale-105">
						<ui-code-window 
							[data]="data().terminalExample"
							[config]="{ variant: 'terminal' }">
						</ui-code-window>
					</div>
					
					@if (data().additionalExamples) {
						@for (example of data().additionalExamples; track example.title) {
							<div class="transform transition-all duration-300 hover:scale-105">
								<ui-code-window 
									[data]="example"
									[config]="getExampleConfig(example)">
								</ui-code-window>
							</div>
						}
					}
				</div>
			} @else {
				<!-- Tabs Layout -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
					<div class="border-b border-gray-200 dark:border-gray-700">
						<nav class="flex">
							<button 
								(click)="setActiveTab('code')"
								class="px-6 py-3 text-sm font-medium transition-colors"
								[class]="getTabClasses('code')">
								📝 Code Example
							</button>
							<button 
								(click)="setActiveTab('terminal')"
								class="px-6 py-3 text-sm font-medium transition-colors"
								[class]="getTabClasses('terminal')">
								🖥️ Terminal
							</button>
							@if (data().additionalExamples) {
								@for (example of data().additionalExamples; track example.title; let i = $index) {
									<button 
										(click)="setActiveTab('additional-' + i)"
										class="px-6 py-3 text-sm font-medium transition-colors"
										[class]="getTabClasses('additional-' + i)">
										{{ getExampleIcon(example) }} {{ example.title }}
									</button>
								}
							}
						</nav>
					</div>
					<div class="p-0">
						@if (activeTab() === 'code') {
							<ui-code-window 
								[data]="data().codeExample"
								[config]="{ variant: 'code' }">
							</ui-code-window>
						} @else if (activeTab() === 'terminal') {
							<ui-code-window 
								[data]="data().terminalExample"
								[config]="{ variant: 'terminal' }">
							</ui-code-window>
						} @else if (data().additionalExamples) {
							@for (example of data().additionalExamples; track example.title; let i = $index) {
								@if (activeTab() === 'additional-' + i) {
									<ui-code-window 
										[data]="example"
										[config]="{ variant: getExampleVariant(example) }">
									</ui-code-window>
								}
							}
						}
					</div>
				</div>
			}
			
			<!-- Code Features Highlight -->
			@if (config().showFeatures) {
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
			}

			<!-- Code Examples Gallery -->
			@if (data().additionalExamples && config().variant !== 'tabs') {
				<div class="mt-16">
					<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
						More Code Examples
					</h3>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						@for (example of data().additionalExamples; track example.title) {
							<div class="transform transition-all duration-300 hover:scale-105">
								<ui-code-window 
									[data]="example"
									[config]="{ variant: getExampleVariant(example) }"
									(onCopy)="handleCodeCopy('gallery', example.title)">>
								</ui-code-window>
							</div>
						}
					</div>
				</div>
			}

			<!-- Code Statistics -->
			<div class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
				<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
					Code Examples Overview
				</h3>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div class="text-center">
						<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ getTotalLines() }}</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Lines of Code</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-green-600 dark:text-green-400">{{ getExampleCount() }}</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Code Examples</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ getLanguageCount() }}</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Languages</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ getCommentCount() }}</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">Comments</div>
					</div>
				</div>
			</div>

			<!-- Interaction Log -->
			@if (interactionLog().length > 0) {
				<div class="mt-8">
					<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Interactions</h4>
					<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto">
						@for (interaction of interactionLog(); track interaction) {
							<div class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ interaction }}</div>
						}
					</div>
				</div>
			}
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeWindowsShowcaseWidget {
	// Internal state
	data = signal<CodeWindowsShowcaseData>({
		codeExample: {
			title: 'Angular Component',
			language: 'typescript',
			lines: [
				{ type: 'comment', content: '// Modern Angular component with signals' },
				{ type: 'keyword', content: 'import { Component, signal, computed } from \'@angular/core\';' },
				{ type: 'normal', content: '' },
				{ type: 'keyword', content: '@Component({' },
				{ type: 'string', content: '  selector: \'app-user-profile\',' },
				{ type: 'string', content: '  template: `' },
				{ type: 'string', content: '    <div class="user-profile">' },
				{ type: 'string', content: '      <h1>{{ userName() }}</h1>' },
				{ type: 'string', content: '      <p>Score: {{ totalScore() }}</p>' },
				{ type: 'string', content: '    </div>` })', },
				{ type: 'keyword', content: 'export class UserProfileComponent {' },
				{ type: 'variable', content: '  score = signal(0);' },
				{ type: 'variable', content: '  userName = signal(\'John Doe\');' },
				{ type: 'normal', content: '' },
				{ type: 'comment', content: '  // Computed property that reacts to signal changes' },
				{ type: 'variable', content: '  totalScore = computed(() => this.score() * 10);' },
				{ type: 'normal', content: '' },
				{ type: 'keyword', content: '  updateScore(newScore: number) {' },
				{ type: 'normal', content: '    this.score.set(newScore);' },
				{ type: 'keyword', content: '  }' },
				{ type: 'keyword', content: '}' }
			]
		},
		terminalExample: {
			title: 'Terminal Commands',
			language: 'shell',
			lines: [
				{ type: 'comment', content: '# Create new Angular application' },
				{ type: 'keyword', content: '$ ng new my-app --routing --style=scss' },
				{ type: 'normal', content: 'CREATE my-app/README.md (1024 bytes)' },
				{ type: 'normal', content: 'CREATE my-app/.editorconfig (274 bytes)' },
				{ type: 'normal', content: 'CREATE my-app/.gitignore (548 bytes)' },
				{ type: 'normal', content: '' },
				{ type: 'comment', content: '# Navigate to project directory' },
				{ type: 'keyword', content: '$ cd my-app' },
				{ type: 'normal', content: '' },
				{ type: 'comment', content: '# Install dependencies' },
				{ type: 'keyword', content: '$ npm install' },
				{ type: 'normal', content: 'added 1200 packages in 30s' },
				{ type: 'normal', content: '' },
				{ type: 'comment', content: '# Start development server' },
				{ type: 'keyword', content: '$ ng serve' },
				{ type: 'normal', content: 'Local:    http://localhost:4200/' },
				{ type: 'string', content: '✓ Compiled successfully.' }
			]
		},
		additionalExamples: [
			{
				title: 'React Component',
				language: 'javascript',
				lines: [
					{ type: 'comment', content: '// React functional component with hooks' },
					{ type: 'keyword', content: 'import React, { useState, useEffect } from \'react\';' },
					{ type: 'normal', content: '' },
					{ type: 'keyword', content: 'function UserProfile({ userId }) {' },
					{ type: 'variable', content: '  const [user, setUser] = useState(null);' },
					{ type: 'variable', content: '  const [loading, setLoading] = useState(true);' },
					{ type: 'normal', content: '' },
					{ type: 'keyword', content: '  useEffect(() => {' },
					{ type: 'keyword', content: '    fetchUser(userId).then(userData => {' },
					{ type: 'normal', content: '      setUser(userData);' },
					{ type: 'normal', content: '      setLoading(false);' },
					{ type: 'keyword', content: '    });' },
					{ type: 'keyword', content: '  }, [userId]);' },
					{ type: 'normal', content: '' },
					{ type: 'keyword', content: '  if (loading) return <div>Loading...</div>;' },
					{ type: 'normal', content: '' },
					{ type: 'keyword', content: '  return (' },
					{ type: 'string', content: '    <div className="user-profile">' },
					{ type: 'string', content: '      <h1>{user.name}</h1>' },
					{ type: 'string', content: '      <p>{user.email}</p>' },
					{ type: 'string', content: '    </div>' },
					{ type: 'keyword', content: '  );' },
					{ type: 'keyword', content: '}' }
				]
			},
			{
				title: 'Python Script',
				language: 'python',
				lines: [
					{ type: 'comment', content: '# Data analysis with pandas' },
					{ type: 'keyword', content: 'import pandas as pd' },
					{ type: 'keyword', content: 'import numpy as np' },
					{ type: 'keyword', content: 'import matplotlib.pyplot as plt' },
					{ type: 'normal', content: '' },
					{ type: 'comment', content: '# Load and process data' },
					{ type: 'variable', content: 'df = pd.read_csv(\'data.csv\')' },
					{ type: 'variable', content: 'df_clean = df.dropna()' },
					{ type: 'normal', content: '' },
					{ type: 'comment', content: '# Perform statistical analysis' },
					{ type: 'variable', content: 'mean_value = df_clean[\'score\'].mean()' },
					{ type: 'variable', content: 'std_value = df_clean[\'score\'].std()' },
					{ type: 'normal', content: '' },
					{ type: 'keyword', content: 'print(f\'Mean: {mean_value:.2f}\')' },
					{ type: 'keyword', content: 'print(f\'Standard Deviation: {std_value:.2f}\')' },
					{ type: 'normal', content: '' },
					{ type: 'comment', content: '# Create visualization' },
					{ type: 'keyword', content: 'plt.figure(figsize=(10, 6))' },
					{ type: 'keyword', content: 'plt.hist(df_clean[\'score\'], bins=30)' },
					{ type: 'keyword', content: 'plt.title(\'Score Distribution\')' },
					{ type: 'keyword', content: 'plt.show()' }
				]
			},
			{
				title: 'Docker Setup',
				language: 'shell',
				lines: [
					{ type: 'comment', content: '# Build Docker image' },
					{ type: 'keyword', content: '$ docker build -t my-app:latest .' },
					{ type: 'normal', content: 'Sending build context to Docker daemon...' },
					{ type: 'normal', content: 'Step 1/5 : FROM node:18-alpine' },
					{ type: 'normal', content: 'Successfully built abc123def456' },
					{ type: 'normal', content: '' },
					{ type: 'comment', content: '# Run container' },
					{ type: 'keyword', content: '$ docker run -p 3000:3000 my-app:latest' },
					{ type: 'normal', content: 'Server started on port 3000' },
					{ type: 'normal', content: '' },
					{ type: 'comment', content: '# Check running containers' },
					{ type: 'keyword', content: '$ docker ps' },
					{ type: 'normal', content: 'CONTAINER ID   IMAGE            COMMAND' },
					{ type: 'normal', content: 'abc123def456   my-app:latest    "npm start"' }
				]
			},
			{
				title: 'SQL Query',
				language: 'sql',
				lines: [
					{ type: 'comment', content: '-- Complex analytics query' },
					{ type: 'keyword', content: 'SELECT' },
					{ type: 'variable', content: '  u.name,' },
					{ type: 'variable', content: '  COUNT(o.id) as order_count,' },
					{ type: 'variable', content: '  SUM(o.total_amount) as total_spent,' },
					{ type: 'variable', content: '  AVG(o.total_amount) as avg_order_value' },
					{ type: 'keyword', content: 'FROM users u' },
					{ type: 'keyword', content: 'LEFT JOIN orders o ON u.id = o.user_id' },
					{ type: 'keyword', content: 'WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)' },
					{ type: 'keyword', content: 'GROUP BY u.id, u.name' },
					{ type: 'keyword', content: 'HAVING COUNT(o.id) > 0' },
					{ type: 'keyword', content: 'ORDER BY total_spent DESC' },
					{ type: 'keyword', content: 'LIMIT 10;' }
				]
			}
		]
	});

	config = signal<CodeWindowsShowcaseConfig>({
		variant: 'side-by-side',
		showFeatures: true,
		enableCopy: true
	});

	// Internal state for tabs
	activeTab = signal<string>('code');

	// Interaction tracking
	interactionLog = signal<string[]>([]);

	setActiveTab(tabId: string): void {
		this.activeTab.set(tabId);
		this.logInteraction(`Switched to tab: ${tabId}`);
	}

	setVariant(variant: string): void {
		this.config.update(config => ({ ...config, variant: variant as 'side-by-side' | 'stacked' | 'tabs' }));
		this.logInteraction(`Changed layout to: ${variant}`);
	}

	toggleFeatures(): void {
		this.config.update(config => ({ ...config, showFeatures: !config.showFeatures }));
		this.logInteraction(`Toggled features display: ${this.config().showFeatures ? 'shown' : 'hidden'}`);
	}

	toggleCopy(): void {
		this.config.update(config => ({ ...config, enableCopy: !config.enableCopy }));
		this.logInteraction(`Toggled copy functionality: ${this.config().enableCopy ? 'enabled' : 'disabled'}`);
	}

	logInteraction(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		this.interactionLog.update(log => [`${timestamp}: ${message}`, ...log.slice(0, 4)]);
	}

	getTabClasses(tabId: string): string {
		const isActive = this.activeTab() === tabId;
		return isActive 
			? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
			: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700';
	}

	getExampleVariant(example: CodeExample): 'code' | 'terminal' {
		// Determine variant based on title or language
		if (example.title.toLowerCase().includes('terminal') || 
			example.title.toLowerCase().includes('command') ||
			example.title.toLowerCase().includes('shell') ||
			example.language === 'shell') {
			return 'terminal';
		}
		return 'code';
	}

	getExampleConfig(example: CodeExample): { variant: 'code' | 'terminal' } {
		return { variant: this.getExampleVariant(example) };
	}

	getExampleIcon(example: CodeExample): string {
		const variant = this.getExampleVariant(example);
		return variant === 'terminal' ? '🖥️' : '📝';
	}

	// Statistics computed properties
	getTotalLines = computed(() => {
		const data = this.data();
		let total = data.codeExample.lines.length + data.terminalExample.lines.length;
		if (data.additionalExamples) {
			total += data.additionalExamples.reduce((sum: number, example: CodeExample) => sum + example.lines.length, 0);
		}
		return total;
	});

	getExampleCount = computed(() => {
		const data = this.data();
		let count = 2; // code + terminal
		if (data.additionalExamples) {
			count += data.additionalExamples.length;
		}
		return count;
	});

	getLanguageCount = computed(() => {
		const languages = new Set<string>();
		const data = this.data();
		if (data.codeExample.language) languages.add(data.codeExample.language);
		if (data.terminalExample.language) languages.add(data.terminalExample.language);
		if (data.additionalExamples) {
			data.additionalExamples.forEach((example: CodeExample) => {
				if (example.language) languages.add(example.language);
			});
		}
		return languages.size;
	});

	getCommentCount = computed(() => {
		const data = this.data();
		let count = data.codeExample.lines.reduce((sum: number, line: CodeLine) => line.type === 'comment' ? sum + 1 : sum, 0);
		count += data.terminalExample.lines.reduce((sum: number, line: CodeLine) => line.type === 'comment' ? sum + 1 : sum, 0);
		if (data.additionalExamples) {
			count += data.additionalExamples.reduce((sum: number, example: CodeExample) =>
				sum + example.lines.reduce((lineSum: number, line: CodeLine) => line.type === 'comment' ? lineSum + 1 : lineSum, 0), 0);
		}
		return count;
	});

	// Event handlers
	onVariantChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		if (target && target.value) {
			this.setVariant(target.value);
		}
	}

	handleCodeCopy(source: string, content: string): void {
		this.logInteraction(`Copied ${source} content: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`);
	}
}
