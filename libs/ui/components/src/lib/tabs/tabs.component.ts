import {
	Component,
	ChangeDetectionStrategy,
	computed,
	signal,
	input,
	output,
	inject,
	TemplateRef,
	OnInit,
	OnDestroy
} from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { 
	TabItem, 
	TabsConfig, 
	TabSelectEvent, 
	TabCloseEvent 
} from './tabs.interfaces';

@Component({
	selector: 'ui-tabs',
	standalone: true,
	imports: [CommonModule],
	host: {
		class: 'ui-tabs block w-full',
		'[attr.data-orientation]': 'config().orientation || "horizontal"',
		'[attr.data-variant]': 'config().variant || "default"'
	},
	template: `
		<div 
			class="tabs-container"
			[class]="containerClasses()">
			
			<!-- Tabs List -->
			<div 
				class="tabs-list"
				[class]="tabsListClasses()"
				role="tablist"
				[attr.aria-orientation]="config().orientation || 'horizontal'">
				
				@for (tab of tabs(); track tab.id; let i = $index) {
					<button
						type="button"
						class="tab"
						[class]="getTabClasses(tab, i)"
						[disabled]="tab.disabled"
						[attr.id]="'tab-' + tab.id"
						[attr.aria-controls]="'panel-' + tab.id"
						[attr.aria-selected]="activeTabIndex() === i"
						[attr.tabindex]="activeTabIndex() === i ? 0 : -1"
						role="tab"
						[title]="tab.tooltip || ''"
						(click)="selectTab(i)"
						(keydown)="onTabKeydown($event, i)">
						
						<!-- Tab Icon -->
						@if (tab.icon) {
							<span class="tab-icon" [class]="config().customClasses?.tabIcon || ''">
								@if (isTemplateRef(tab.icon)) {
									<ng-container [ngTemplateOutlet]="$any(tab.icon)"></ng-container>
								} @else {
									<span [innerHTML]="tab.icon"></span>
								}
							</span>
						}
						
						<!-- Tab Label -->
						<span class="tab-label" [class]="config().customClasses?.tabLabel || ''">
							{{ tab.label }}
						</span>
						
						<!-- Tab Badge -->
						@if (tab.badge) {
							<span class="tab-badge" [class]="config().customClasses?.tabBadge || ''">
								{{ tab.badge }}
							</span>
						}
						
						<!-- Close Button -->
						@if (tab.closable && config().showCloseButtons !== false) {
							<button
								type="button"
								class="close-button"
								[class]="config().customClasses?.closeButton || ''"
								[attr.aria-label]="'Close ' + tab.label"
								(click)="closeTab($event, i)">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
								</svg>
							</button>
						}
					</button>
				}
				
				<!-- Active Tab Indicator -->
				@if (showIndicator()) {
					<div 
						class="tab-indicator"
						[class]="config().customClasses?.indicator || ''"
						[style]="indicatorStyle()">
					</div>
				}
			</div>
			
			<!-- Tab Content -->
			<div 
				class="tab-content"
				[class]="contentClasses()">
				
				@for (tab of tabs(); track tab.id; let i = $index) {
					@if (activeTabIndex() === i || !tab.lazy || hasBeenActive().has(tab.id)) {
						<div
							class="tab-panel"
							[class]="panelClasses(i)"
							[attr.id]="'panel-' + tab.id"
							[attr.aria-labelledby]="'tab-' + tab.id"
							[attr.hidden]="activeTabIndex() !== i"
							role="tabpanel">
							
							@if (tab.content) {
								<ng-container [ngTemplateOutlet]="tab.content"></ng-container>
							} @else {
								<ng-content [select]="'[slot=tab-' + tab.id + ']'"></ng-content>
							}
						</div>
					}
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnInit, OnDestroy {
	// Inputs
	tabs = input.required<TabItem[]>();
	config = input<TabsConfig>({});
	activeTab = input<string | number>();

	// Outputs
	tabSelect = output<TabSelectEvent>();
	tabClose = output<TabCloseEvent>();

	// Internal state
	activeTabIndex = signal<number>(0);
	hasBeenActive = signal<Set<string>>(new Set());
	
	private document = inject(DOCUMENT);

	// Computed properties
	containerClasses = computed(() => {
		const config = this.config();
		const orientation = config.orientation || 'horizontal';
		const position = config.position || 'top';
		
		return [
			'tabs-container',
			`orientation-${orientation}`,
			`position-${position}`,
			config.animated !== false ? 'animated' : '',
			config.customClasses?.container || '',
			// Base container styles
			orientation === 'horizontal' ? 'flex flex-col' : 'flex',
			orientation === 'vertical' && position === 'left' ? 'flex-row' : '',
			orientation === 'vertical' && position === 'right' ? 'flex-row-reverse' : ''
		].filter(Boolean).join(' ');
	});

	tabsListClasses = computed(() => {
		const config = this.config();
		const orientation = config.orientation || 'horizontal';
		const variant = config.variant || 'default';
		const size = config.size || 'md';
		
		return [
			'tabs-list',
			`variant-${variant}`,
			`size-${size}`,
			config.centered ? 'justify-center' : '',
			config.fullWidth ? 'w-full' : '',
			config.customClasses?.tabsList || '',
			// Base list styles
			'relative flex',
			orientation === 'horizontal' ? 'flex-row border-b border-gray-200 dark:border-gray-700' : 'flex-col border-r border-gray-200 dark:border-gray-700',
			// Variant styles
			variant === 'pills' ? 'gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg' : '',
			variant === 'bordered' ? 'border border-gray-200 dark:border-gray-700 rounded-t-lg' : '',
			variant === 'minimal' ? 'border-0' : ''
		].filter(Boolean).join(' ');
	});

	contentClasses = computed(() => {
		const config = this.config();
		
		return [
			'tab-content',
			'flex-1',
			config.customClasses?.content || '',
			// Base content styles
			'p-4',
			config.variant === 'bordered' ? 'border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg' : ''
		].filter(Boolean).join(' ');
	});

	showIndicator = computed(() => {
		const variant = this.config().variant || 'default';
		return variant === 'underline' || variant === 'default';
	});

	indicatorStyle = computed(() => {
		const config = this.config();
		const orientation = config.orientation || 'horizontal';
		const activeIndex = this.activeTabIndex();
		const tabs = this.tabs();
		
		if (!tabs.length || activeIndex < 0) return {};
		
		// Simple indicator positioning (would need proper measurement in real implementation)
		const percentage = (100 / tabs.length);
		const offset = percentage * activeIndex;
		
		if (orientation === 'horizontal') {
			return {
				transform: `translateX(${offset}%)`,
				width: `${percentage}%`,
				height: '2px',
				bottom: '0',
				left: '0',
				position: 'absolute',
				backgroundColor: 'currentColor',
				transition: config.animated !== false ? `transform ${config.animationDuration || 200}ms ease` : 'none'
			};
		} else {
			return {
				transform: `translateY(${offset}%)`,
				height: `${percentage}%`,
				width: '2px',
				top: '0',
				right: '0',
				position: 'absolute',
				backgroundColor: 'currentColor',
				transition: config.animated !== false ? `transform ${config.animationDuration || 200}ms ease` : 'none'
			};
		}
	});

	ngOnInit(): void {
		// Set initial active tab
		const activeTab = this.activeTab();
		if (activeTab !== undefined) {
			const index = typeof activeTab === 'number' 
				? activeTab 
				: this.tabs().findIndex(tab => tab.id === activeTab);
			if (index >= 0) {
				this.activeTabIndex.set(index);
			}
		}
		
		// Mark initial tab as active
		const tabs = this.tabs();
		if (tabs.length > 0) {
			const activeIndex = this.activeTabIndex();
			const activeTabItem = tabs[activeIndex];
			if (activeTabItem) {
				this.hasBeenActive.update(set => new Set([...set, activeTabItem.id]));
			}
		}
	}

	ngOnDestroy(): void {
		// Cleanup if needed
	}

	getTabClasses(tab: TabItem, index: number): string {
		const config = this.config();
		const isActive = this.activeTabIndex() === index;
		const variant = config.variant || 'default';
		const size = config.size || 'md';
		
		return [
			'tab',
			`size-${size}`,
			isActive ? 'active' : '',
			tab.disabled ? 'disabled' : '',
			config.customClasses?.tab || '',
			isActive ? config.customClasses?.activeTab || '' : '',
			tab.disabled ? config.customClasses?.disabledTab || '' : '',
			// Base tab styles
			'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
			'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
			// Size styles
			size === 'sm' ? 'px-3 py-1.5 text-xs' : '',
			size === 'lg' ? 'px-6 py-3 text-base' : '',
			// Variant styles
			variant === 'default' ? this.getDefaultTabStyles(isActive, tab.disabled) : '',
			variant === 'pills' ? this.getPillsTabStyles(isActive, tab.disabled) : '',
			variant === 'underline' ? this.getUnderlineTabStyles(isActive, tab.disabled) : '',
			variant === 'bordered' ? this.getBorderedTabStyles(isActive, tab.disabled) : '',
			variant === 'minimal' ? this.getMinimalTabStyles(isActive, tab.disabled) : ''
		].filter(Boolean).join(' ');
	}

	panelClasses(index: number): string {
		const config = this.config();
		const isActive = this.activeTabIndex() === index;
		
		return [
			'tab-panel',
			config.customClasses?.panel || '',
			// Base panel styles
			isActive ? 'block' : 'hidden',
			config.animated !== false ? 'transition-opacity duration-200' : '',
			isActive ? 'opacity-100' : 'opacity-0'
		].filter(Boolean).join(' ');
	}

	selectTab(index: number): void {
		const tabs = this.tabs();
		const tab = tabs[index];
		
		if (!tab || tab.disabled) return;
		
		const previousIndex = this.activeTabIndex();
		const previousTab = tabs[previousIndex];
		
		this.activeTabIndex.set(index);
		
		// Mark tab as having been active (for lazy loading)
		this.hasBeenActive.update(set => new Set([...set, tab.id]));
		
		// Emit selection event
		this.tabSelect.emit({
			tab,
			index,
			previousTab,
			previousIndex
		});
	}

	closeTab(event: Event, index: number): void {
		event.stopPropagation();
		
		const tabs = this.tabs();
		const tab = tabs[index];
		
		if (!tab || !tab.closable) return;
		
		let shouldClose = true;
		
		const closeEvent: TabCloseEvent = {
			tab,
			index,
			preventDefault: () => { shouldClose = false; }
		};
		
		this.tabClose.emit(closeEvent);
		
		if (shouldClose) {
			// If closing active tab, select next available tab
			if (this.activeTabIndex() === index) {
				const nextIndex = index < tabs.length - 1 ? index : index - 1;
				if (nextIndex >= 0 && nextIndex < tabs.length) {
					this.selectTab(nextIndex);
				}
			} else if (this.activeTabIndex() > index) {
				// Adjust active index if removing a tab before current
				this.activeTabIndex.update(current => current - 1);
			}
		}
	}

	onTabKeydown(event: KeyboardEvent, index: number): void {
		if (!this.config().keyboardNavigation) return;
		
		const tabs = this.tabs();
		const orientation = this.config().orientation || 'horizontal';
		
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				if ((orientation === 'horizontal' && event.key === 'ArrowLeft') ||
					(orientation === 'vertical' && event.key === 'ArrowUp')) {
					event.preventDefault();
					this.focusPreviousTab(index);
				}
				break;
				
			case 'ArrowRight':
			case 'ArrowDown':
				if ((orientation === 'horizontal' && event.key === 'ArrowRight') ||
					(orientation === 'vertical' && event.key === 'ArrowDown')) {
					event.preventDefault();
					this.focusNextTab(index);
				}
				break;
				
			case 'Home':
				event.preventDefault();
				this.focusFirstTab();
				break;
				
			case 'End':
				event.preventDefault();
				this.focusLastTab();
				break;
				
			case 'Enter':
			case ' ':
				event.preventDefault();
				this.selectTab(index);
				break;
		}
	}

	private focusPreviousTab(currentIndex: number): void {
		const tabs = this.tabs();
		let index = currentIndex - 1;
		
		while (index >= 0 && tabs[index]?.disabled) {
			index--;
		}
		
		if (index >= 0) {
			this.focusTab(index);
		}
	}

	private focusNextTab(currentIndex: number): void {
		const tabs = this.tabs();
		let index = currentIndex + 1;
		
		while (index < tabs.length && tabs[index]?.disabled) {
			index++;
		}
		
		if (index < tabs.length) {
			this.focusTab(index);
		}
	}

	private focusFirstTab(): void {
		const tabs = this.tabs();
		let index = 0;
		
		while (index < tabs.length && tabs[index]?.disabled) {
			index++;
		}
		
		if (index < tabs.length) {
			this.focusTab(index);
		}
	}

	private focusLastTab(): void {
		const tabs = this.tabs();
		let index = tabs.length - 1;
		
		while (index >= 0 && tabs[index]?.disabled) {
			index--;
		}
		
		if (index >= 0) {
			this.focusTab(index);
		}
	}

	private focusTab(index: number): void {
		const tabs = this.tabs();
		const tab = tabs[index];
		
		if (!tab || tab.disabled) return;
		
		// Focus the tab button
		const tabElement = this.document.getElementById(`tab-${tab.id}`);
		if (tabElement) {
			tabElement.focus();
		}
	}

	isTemplateRef(value: unknown): value is TemplateRef<unknown> {
		return value instanceof TemplateRef;
	}

	// Style helper methods
	private getDefaultTabStyles(isActive: boolean, isDisabled?: boolean): string {
		if (isDisabled) {
			return 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
		}
		
		return isActive 
			? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
			: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
	}

	private getPillsTabStyles(isActive: boolean, isDisabled?: boolean): string {
		if (isDisabled) {
			return 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
		}
		
		return isActive 
			? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm rounded-md'
			: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-md';
	}

	private getUnderlineTabStyles(isActive: boolean, isDisabled?: boolean): string {
		if (isDisabled) {
			return 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
		}
		
		return isActive 
			? 'text-blue-600 dark:text-blue-400'
			: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
	}

	private getBorderedTabStyles(isActive: boolean, isDisabled?: boolean): string {
		if (isDisabled) {
			return 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
		}
		
		return isActive 
			? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700 rounded-t-lg -mb-px'
			: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
	}

	private getMinimalTabStyles(isActive: boolean, isDisabled?: boolean): string {
		if (isDisabled) {
			return 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
		}
		
		return isActive 
			? 'text-gray-900 dark:text-white font-semibold'
			: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
	}
}
