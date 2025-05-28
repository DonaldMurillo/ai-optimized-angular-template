import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { 
	AlertComponent, 
	LoadingComponent, 
	ProgressComponent, 
	ToastComponent 
} from '@ui/components';

@Component({
	selector: 'ui-feedback-showcase-widget',
	standalone: true,
	imports: [
		AlertComponent,
		LoadingComponent,
		ProgressComponent,
		ToastComponent
	],
	host: {
		class: 'block'
	},
	template: `
		<section class="scroll-mt-24">
			<div class="text-center mb-12">
				<div class="inline-flex items-center gap-3 mb-4">
					<span class="text-2xl">💬</span>
					<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Feedback Components
					</h2>
				</div>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					User feedback elements including alerts, loading indicators, progress bars, toasts, and tooltips
				</p>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Alerts -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Alert Messages</h3>
					</div>
					<div class="space-y-4">
						<ui-alert 
							[data]="{ title: 'Success!', message: 'Your changes have been saved successfully.' }"
							[config]="{ variant: 'success', dismissible: true, showIcon: true }">
						</ui-alert>
						<ui-alert 
							[data]="{ title: 'Warning', message: 'Please review your input before proceeding.' }"
							[config]="{ variant: 'warning', dismissible: true, showIcon: true }">
						</ui-alert>
						<ui-alert 
							[data]="{ title: 'Error', message: 'Something went wrong. Please try again.' }"
							[config]="{ variant: 'error', dismissible: true, showIcon: true }">
						</ui-alert>
						<ui-alert 
							[data]="{ title: 'Info', message: 'New features are available in this update.' }"
							[config]="{ variant: 'info', dismissible: true, showIcon: true }">
						</ui-alert>
					</div>
				</div>

				<!-- Loading States -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading Indicators</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Different Types</h4>
							<div class="grid grid-cols-4 gap-4">
								<div class="flex flex-col items-center gap-2">
									<ui-loading 
										[data]="{ show: true }"
										[config]="{ type: 'spinner', size: 'md', color: 'primary' }">
									</ui-loading>
									<span class="text-xs text-gray-500">Spinner</span>
								</div>
								<div class="flex flex-col items-center gap-2">
									<ui-loading 
										[data]="{ show: true }"
										[config]="{ type: 'dots', size: 'md', color: 'success' }">
									</ui-loading>
									<span class="text-xs text-gray-500">Dots</span>
								</div>
								<div class="flex flex-col items-center gap-2">
									<ui-loading 
										[data]="{ show: true }"
										[config]="{ type: 'pulse', size: 'md', color: 'secondary' }">
									</ui-loading>
									<span class="text-xs text-gray-500">Pulse</span>
								</div>
								<div class="flex flex-col items-center gap-2">
									<ui-loading 
										[data]="{ show: true }"
										[config]="{ type: 'bars', size: 'md', color: 'error' }">
									</ui-loading>
									<span class="text-xs text-gray-500">Bars</span>
								</div>
							</div>
						</div>
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">With Text</h4>
							<ui-loading 
								[data]="{ text: 'Loading your data...', show: true }"
								[config]="{ type: 'spinner', size: 'lg', color: 'primary' }">
							</ui-loading>
						</div>
					</div>
				</div>

				<!-- Progress Bars -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Progress Indicators</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Linear Progress</h4>
							<ui-progress 
								[data]="{ value: progressValue(), max: 100, label: 'Upload Progress' }"
								[config]="{ variant: 'primary', showLabel: true }">
							</ui-progress>
						</div>
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Different Variants</h4>
							<div class="space-y-3">
								<ui-progress 
									[data]="{ value: 75, max: 100, label: 'Processing...' }"
									[config]="{ variant: 'success', showLabel: true }">
								</ui-progress>
								<ui-progress 
									[data]="{ value: 45, max: 100, label: 'Download Progress' }"
									[config]="{ variant: 'warning', showLabel: true }">
								</ui-progress>
								<ui-progress 
									[data]="{ value: 25, max: 100, label: 'Connection' }"
									[config]="{ variant: 'error', showLabel: true }">
								</ui-progress>
							</div>
						</div>
					</div>
				</div>

				<!-- Interactive Demo Section -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Interactive Demo</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Progress Control</h4>
							<div class="space-y-3">
								<div class="flex items-center gap-4">
									<button 
										(click)="updateProgress(-10)"
										class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
										-10%
									</button>
									<button 
										(click)="updateProgress(10)"
										class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
										+10%
									</button>
									<span class="text-sm text-gray-600 dark:text-gray-400">Current: {{ progressValue() }}%</span>
								</div>
								<ui-progress 
									[data]="{ value: progressValue(), max: 100, label: 'Interactive Progress' }"
									[config]="{ variant: 'primary', showLabel: true, showPercentage: true }">
								</ui-progress>
							</div>
						</div>
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Toast Variants</h4>
							<div class="grid grid-cols-2 gap-2">
								<button 
									(click)="showToast('success')"
									class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
									Success
								</button>
								<button 
									(click)="showToast('warning')"
									class="px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors">
									Warning
								</button>
								<button 
									(click)="showToast('error')"
									class="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
									Error
								</button>
								<button 
									(click)="showToast('info')"
									class="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
									Info
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Toast Container -->
			@if (showingToast()) {
				<div class="fixed top-4 right-4 z-50">
					<ui-toast 
						[data]="toastData()"
						[config]="{ position: 'top-right', duration: 3000, dismissible: true }"
						(onDismiss)="hideToast()">
					</ui-toast>
				</div>
			}
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackShowcaseWidget {
	// Internal state for interactive demonstrations
	progressValue = signal(60);
	showingToast = signal(false);
	toastData = signal<{
		title?: string;
		message: string;
		variant: 'success' | 'error' | 'warning' | 'info';
	}>({
		message: '',
		variant: 'info'
	});

	updateProgress(delta: number): void {
		this.progressValue.update(current => Math.max(0, Math.min(100, current + delta)));
	}

	showToast(variant: 'success' | 'error' | 'warning' | 'info'): void {
		const messages = {
			success: { title: 'Success!', message: 'Operation completed successfully' },
			error: { title: 'Error', message: 'Something went wrong' },
			warning: { title: 'Warning', message: 'Please check your input' },
			info: { title: 'Info', message: 'Here is some information' }
		};

		this.toastData.set({
			...messages[variant],
			variant
		});
		this.showingToast.set(true);

		// Auto-hide after 3 seconds
		setTimeout(() => this.hideToast(), 3000);
	}

	hideToast(): void {
		this.showingToast.set(false);
	}
}
