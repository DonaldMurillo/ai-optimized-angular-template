import { Component, ChangeDetectionStrategy, signal, computed, inject, input, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ModalData {
	isOpen: boolean;
	title?: string;
	content?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	showHeader?: boolean;
	showFooter?: boolean;
	closable?: boolean;
	closeOnBackdrop?: boolean;
}

export interface ModalConfig {
	size: 'sm' | 'md' | 'lg' | 'xl';
	showHeader: boolean;
	showFooter: boolean;
	closable: boolean;
	closeOnBackdrop: boolean;
	animation: boolean;
}

@Component({
	selector: 'ui-modal',
	standalone: true,
	template: `
		@if (isOpen()) {
			<div 
				class="fixed inset-0 z-50 overflow-y-auto"
				role="dialog"
				aria-modal="true"
				[attr.aria-labelledby]="title() ? 'modal-title' : null"
				(keydown.escape)="handleEscapeKey()"
			>
				<!-- Backdrop -->
				<div 
					class="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out"
					[class.opacity-0]="!backdropVisible()"
					[class.opacity-100]="backdropVisible()"
					(click)="handleBackdropClick()"
				></div>

				<!-- Modal Container -->
				<div class="flex min-h-full items-center justify-center p-4">
					<div 
						class="relative w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-out"
						[class]="modalClasses()"
						[class.scale-95]="!contentVisible()"
						[class.opacity-0]="!contentVisible()"
						[class.scale-100]="contentVisible()"
						[class.opacity-100]="contentVisible()"
					>
						<!-- Header -->
						@if (showHeader()) {
							<div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
								@if (title()) {
									<h3 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
										{{ title() }}
									</h3>
								} @else {
									<div>
										<ng-content select="[slot=header]"></ng-content>
									</div>
								}
								
								@if (closable()) {
									<button
										type="button"
										class="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
										(click)="close()"
										aria-label="Close modal"
									>
										<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
										</svg>
									</button>
								}
							</div>
						}

						<!-- Body -->
						<div class="px-6 py-4">
							@if (content()) {
								<p class="text-gray-700 dark:text-gray-300">{{ content() }}</p>
							} @else {
								<ng-content></ng-content>
							}
						</div>

						<!-- Footer -->
						@if (showFooter()) {
							<div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
								<ng-content select="[slot=footer]"></ng-content>
							</div>
						}
					</div>
				</div>
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
	// Inputs
	isOpen = input<boolean>(false);
	title = input<string>('');
	content = input<string>('');
	size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
	showHeader = input<boolean>(true);
	showFooter = input<boolean>(false);
	closable = input<boolean>(true);
	closeOnBackdrop = input<boolean>(true);

	// Outputs
	onClose = output<void>();
	onOpen = output<void>();

	// Private properties
	private document = inject(DOCUMENT);
	
	// Animation state signals (public for template access)
	backdropVisible = signal(false);
	contentVisible = signal(false);

	// Computed properties
	modalClasses = computed(() => {
		const sizeClasses = {
			sm: 'max-w-sm w-full',      // ~384px
			md: 'max-w-md w-full',      // ~448px  
			lg: 'max-w-2xl w-full',     // ~672px
			xl: 'max-w-4xl w-full'      // ~896px
		};
		return sizeClasses[this.size()];
	});

	constructor() {
		// Handle modal opening/closing animations using effect
		effect(() => {
			const isOpen = this.isOpen();
			if (isOpen) {
				this.openModal();
			} else {
				this.closeModal();
			}
		});
	}

	private openModal(): void {
		// Prevent body scroll
		this.document.body.style.overflow = 'hidden';
		
		// Show backdrop first, then content with slight delay for animation
		this.backdropVisible.set(true);
		setTimeout(() => {
			this.contentVisible.set(true);
		}, 50);

		// Focus management - focus the modal
		setTimeout(() => {
			const modal = this.document.querySelector('[role="dialog"]') as HTMLElement;
			if (modal) {
				modal.focus();
			}
		}, 100);

		this.onOpen.emit();
	}

	private closeModal(): void {
		// Immediately restore body scroll
		this.document.body.style.overflow = '';
		
		// Hide content first, then backdrop
		this.contentVisible.set(false);
		setTimeout(() => {
			this.backdropVisible.set(false);
		}, 300);
	}

	close(): void {
		if (this.closable()) {
			// Ensure scroll is restored immediately when closing
			this.document.body.style.overflow = '';
			this.onClose.emit();
		}
	}

	handleBackdropClick(): void {
		if (this.closeOnBackdrop()) {
			// Ensure scroll is restored immediately
			this.document.body.style.overflow = '';
			this.close();
		}
	}

	handleEscapeKey(): void {
		if (this.closable()) {
			// Ensure scroll is restored immediately
			this.document.body.style.overflow = '';
			this.close();
		}
	}
}
