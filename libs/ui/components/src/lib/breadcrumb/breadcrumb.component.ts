import { 
	Component, 
	ChangeDetectionStrategy, 
	input, 
	output, 
	computed, 
	signal,
	inject,
	TemplateRef
} from '@angular/core';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { 
	BreadcrumbConfig, 
	BreadcrumbItem
} from './breadcrumb.interfaces';

@Component({
	selector: 'ui-breadcrumb',
	standalone: true,
	imports: [NgTemplateOutlet],
	template: `
		<nav 
			[attr.aria-label]="ariaLabel()"
			[class]="containerClasses()"
			role="navigation">
			
			<ol [class]="listClasses()">
				@if (showOverflow() && visibleItems().overflowItems.length > 0) {
					<!-- Home item if shown -->
					@if (config().showHomeIcon && visibleItems().displayItems[0]) {
						<li [class]="itemClasses()">
							<button
								type="button"
								[class]="linkClasses()"
								[disabled]="visibleItems().displayItems[0].disabled"
								(click)="handleItemClick(visibleItems().displayItems[0])"
								[attr.aria-current]="isCurrentPage(visibleItems().displayItems[0]) ? 'page' : null">
								@if (config().showIcons && visibleItems().displayItems[0].icon) {
									@if (isTemplateRef(visibleItems().displayItems[0].icon)) {
										<ng-container 
											[ngTemplateOutlet]="asTemplateRef(visibleItems().displayItems[0].icon)"
											[ngTemplateOutletContext]="{ item: visibleItems().displayItems[0] }">
										</ng-container>
									} @else {
										<span [innerHTML]="visibleItems().displayItems[0].icon"></span>
									}
								}
								<span>{{ visibleItems().displayItems[0].label }}</span>
							</button>
						</li>
						
						<!-- Separator -->
						<li [class]="separatorClasses()" aria-hidden="true">
							@if (config().customSeparator) {
								@if (isTemplateRef(config().customSeparator)) {
									<ng-container [ngTemplateOutlet]="asTemplateRef(config().customSeparator)"></ng-container>
								} @else {
									<span [innerHTML]="config().customSeparator"></span>
								}
							} @else {
								<span [innerHTML]="getSeparatorIcon()"></span>
							}
						</li>
					}
					
					<!-- Overflow dropdown -->
					<li [class]="itemClasses()">
						<button
							type="button"
							[class]="overflowButtonClasses()"
							(click)="toggleOverflow()"
							[attr.aria-expanded]="showOverflowMenu()"
							aria-haspopup="true">
							<span>...</span>
						</button>
						
						@if (showOverflowMenu()) {
							<div [class]="overflowMenuClasses()">
								@for (item of visibleItems().overflowItems; track item.label) {
									<button
										type="button"
										[class]="overflowItemClasses()"
										[disabled]="item.disabled"
										(click)="handleItemClick(item)">
										@if (config().showIcons && item.icon) {
											@if (isTemplateRef(item.icon)) {
												<ng-container 
													[ngTemplateOutlet]="asTemplateRef(item.icon)"
													[ngTemplateOutletContext]="{ item }">
												</ng-container>
											} @else {
												<span [innerHTML]="item.icon"></span>
											}
										}
										<span>{{ item.label }}</span>
									</button>
								}
							</div>
						}
					</li>
					
					<!-- Separator -->
					<li [class]="separatorClasses()" aria-hidden="true">
						@if (config().customSeparator) {
							@if (isTemplateRef(config().customSeparator)) {
								<ng-container [ngTemplateOutlet]="asTemplateRef(config().customSeparator)"></ng-container>
							} @else {
								<span [innerHTML]="config().customSeparator"></span>
							}
						} @else {
							<span [innerHTML]="getSeparatorIcon()"></span>
						}
					</li>
				}
				
				<!-- Regular items -->
				@for (item of visibleItems().displayItems.slice(config().showHomeIcon ? 1 : 0); track item.label; let isLast = $last) {
					<li [class]="itemClasses()">
						@if (item.url && !isCurrentPage(item)) {
							<button
								type="button"
								[class]="linkClasses()"
								[disabled]="item.disabled"
								(click)="handleItemClick(item)"
								[attr.aria-current]="isCurrentPage(item) ? 'page' : null">
								@if (config().showIcons && item.icon) {
									@if (isTemplateRef(item.icon)) {
										<ng-container 
											[ngTemplateOutlet]="asTemplateRef(item.icon)"
											[ngTemplateOutletContext]="{ item }">
										</ng-container>
									} @else {
										<span [innerHTML]="item.icon"></span>
									}
								}
								<span>{{ item.label }}</span>
							</button>
						} @else {
							<span [class]="currentPageClasses()">
								@if (config().showIcons && item.icon) {
									@if (isTemplateRef(item.icon)) {
										<ng-container 
											[ngTemplateOutlet]="asTemplateRef(item.icon)"
											[ngTemplateOutletContext]="{ item }">
										</ng-container>
									} @else {
										<span [innerHTML]="item.icon"></span>
									}
								}
								<span>{{ item.label }}</span>
							</span>
						}
					</li>
					
					@if (!isLast) {
						<!-- Separator -->
						<li [class]="separatorClasses()" aria-hidden="true">
							@if (config().customSeparator) {
								@if (isTemplateRef(config().customSeparator)) {
									<ng-container [ngTemplateOutlet]="asTemplateRef(config().customSeparator)"></ng-container>
								} @else {
									<span [innerHTML]="config().customSeparator"></span>
								}
							} @else {
								<span [innerHTML]="getSeparatorIcon()"></span>
							}
						</li>
					}
				}
			</ol>
		</nav>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
	private document = inject(DOCUMENT);
	
	// Inputs
	config = input.required<BreadcrumbConfig>();
	items = input.required<BreadcrumbItem[]>();
	currentPath = input<string>('');
	ariaLabel = input<string>('Breadcrumb navigation');
	
	// Outputs
	itemClick = output<BreadcrumbItem>();
	overflowToggle = output<boolean>();
	
	// State
	showOverflowMenu = signal(false);
	
	// Computed properties
	visibleItems = computed(() => {
		const config = this.config();
		const items = this.items();
		const maxItems = config.maxItems || 5;
		
		if (items.length <= maxItems) {
			return {
				displayItems: items,
				overflowItems: []
			};
		}
		
		// Keep first, last, and some middle items
		const keepFirst = config.showHomeIcon ? 1 : 0;
		const keepLast = 1;
		const availableMiddle = maxItems - keepFirst - keepLast - 1; // -1 for overflow indicator
		
		const firstItems = items.slice(0, keepFirst);
		const lastItems = items.slice(-keepLast);
		const middleItems = items.slice(keepFirst, -keepLast);
		
		if (middleItems.length <= availableMiddle) {
			return {
				displayItems: items,
				overflowItems: []
			};
		}
		
		const visibleMiddle = middleItems.slice(-availableMiddle);
		const overflowItems = middleItems.slice(0, -availableMiddle);
		
		return {
			displayItems: [...firstItems, ...visibleMiddle, ...lastItems],
			overflowItems
		};
	});
	
	showOverflow = computed(() => this.visibleItems().overflowItems.length > 0);
	
	containerClasses = computed(() => {
		const config = this.config();
		const baseClasses = 'w-full';
		const customClasses = config.customClasses?.container || '';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	listClasses = computed(() => {
		const config = this.config();
		const size = config.size || 'md';
		const variant = config.variant || 'default';
		const customClasses = config.customClasses?.list || '';
		
		const baseClasses = 'flex items-center flex-wrap';
		const sizeClasses = {
			sm: 'gap-1 text-sm',
			md: 'gap-2 text-base',
			lg: 'gap-3 text-lg'
		};
		const variantClasses = {
			default: '',
			simple: '',
			pills: 'bg-gray-100 dark:bg-gray-800 rounded-lg p-2',
			minimal: ''
		};
		
		return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${customClasses}`.trim();
	});
	
	itemClasses = computed(() => {
		const config = this.config();
		const customClasses = config.customClasses?.item || '';
		const baseClasses = 'flex items-center';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	linkClasses = computed(() => {
		const config = this.config();
		const variant = config.variant || 'default';
		const customClasses = config.customClasses?.link || '';
		
		const baseClasses = 'flex items-center gap-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded';
		const variantClasses = {
			default: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline',
			simple: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
			pills: 'px-2 py-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
			minimal: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
		};
		const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline';
		
		return `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${customClasses}`.trim();
	});
	
	currentPageClasses = computed(() => {
		const config = this.config();
		const variant = config.variant || 'default';
		const customClasses = config.customClasses?.current || '';
		
		const baseClasses = 'flex items-center gap-1 font-medium';
		const variantClasses = {
			default: 'text-gray-900 dark:text-gray-100',
			simple: 'text-gray-900 dark:text-gray-100',
			pills: 'px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
			minimal: 'text-gray-700 dark:text-gray-300'
		};
		
		return `${baseClasses} ${variantClasses[variant]} ${customClasses}`.trim();
	});
	
	separatorClasses = computed(() => {
		const config = this.config();
		const customClasses = config.customClasses?.separator || '';
		const baseClasses = 'flex items-center text-gray-400 dark:text-gray-500 select-none';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	overflowButtonClasses = computed(() => {
		const config = this.config();
		const baseClasses = 'px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';
		const customClasses = config.customClasses?.overflow || '';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	overflowMenuClasses = computed(() => {
		const config = this.config();
		const baseClasses = 'absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-10 min-w-32';
		const customClasses = config.customClasses?.overflow || '';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	overflowItemClasses = computed(() => {
		const config = this.config();
		const baseClasses = 'w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
		const customClasses = config.customClasses?.overflow || '';
		
		return `${baseClasses} ${customClasses}`.trim();
	});
	
	// Methods
	isCurrentPage(item: BreadcrumbItem): boolean {
		const currentPath = this.currentPath();
		return currentPath ? item.url === currentPath : false;
	}
	
	getSeparatorIcon(): string {
		const separator = this.config().separator || 'slash';
		const separatorIcons: Record<string, string> = {
			slash: '/',
			chevron: '›',
			arrow: '→',
			dash: '-',
			dot: '•'
		};
		
		return separatorIcons[separator] || '/';
	}
	
	isTemplateRef(value: unknown): value is TemplateRef<unknown> {
		return value instanceof TemplateRef;
	}
	
	asTemplateRef(value: unknown): TemplateRef<unknown> {
		return value as TemplateRef<unknown>;
	}
	
	handleItemClick(item: BreadcrumbItem): void {
		if (!item.disabled) {
			this.itemClick.emit(item);
		}
	}
	
	toggleOverflow(): void {
		const newValue = !this.showOverflowMenu();
		this.showOverflowMenu.set(newValue);
		this.overflowToggle.emit(newValue);
		
		// Close overflow menu when clicking outside
		if (newValue) {
			const closeHandler = (event: Event) => {
				const target = event.target as Element;
				if (!target.closest('[aria-haspopup="true"]')) {
					this.showOverflowMenu.set(false);
					this.overflowToggle.emit(false);
					this.document.removeEventListener('click', closeHandler);
				}
			};
			
			// Add listener on next tick to avoid immediate closure
			setTimeout(() => {
				this.document.addEventListener('click', closeHandler);
			}, 0);
		}
	}
}
