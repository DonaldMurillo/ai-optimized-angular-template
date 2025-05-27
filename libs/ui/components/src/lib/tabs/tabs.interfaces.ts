import { TemplateRef } from '@angular/core';

/**
 * Represents a single tab item
 */
export interface TabItem {
	/** Unique identifier for the tab */
	id: string;
	/** Display label for the tab */
	label: string;
	/** Optional icon template or HTML content */
	icon?: TemplateRef<unknown> | string;
	/** Optional badge content to show in tab */
	badge?: string | number;
	/** Whether the tab is disabled */
	disabled?: boolean;
	/** Whether the tab can be closed */
	closable?: boolean;
	/** Content template for the tab panel */
	content?: TemplateRef<unknown>;
	/** Optional tooltip text */
	tooltip?: string;
	/** Whether to lazy load the content */
	lazy?: boolean;
	/** Custom data associated with tab */
	data?: unknown;
}

/**
 * Configuration for the tabs component styling and behavior
 */
export interface TabsConfig {
	/** Visual variant of the tabs */
	variant?: 'default' | 'pills' | 'underline' | 'bordered' | 'minimal';
	/** Size of the tabs */
	size?: 'sm' | 'md' | 'lg';
	/** Orientation of the tabs */
	orientation?: 'horizontal' | 'vertical';
	/** Position of the tabs relative to content */
	position?: 'top' | 'bottom' | 'left' | 'right';
	/** Whether tabs should be centered */
	centered?: boolean;
	/** Whether tabs should fill available width */
	fullWidth?: boolean;
	/** Whether to show animations */
	animated?: boolean;
	/** Animation duration in milliseconds */
	animationDuration?: number;
	/** Whether to enable keyboard navigation */
	keyboardNavigation?: boolean;
	/** Whether to show close buttons on closable tabs */
	showCloseButtons?: boolean;
	/** Custom CSS classes for styling */
	customClasses?: {
		container?: string;
		tabsList?: string;
		tab?: string;
		activeTab?: string;
		disabledTab?: string;
		tabIcon?: string;
		tabLabel?: string;
		tabBadge?: string;
		closeButton?: string;
		content?: string;
		panel?: string;
		indicator?: string;
	};
}

/**
 * Event emitted when a tab is selected
 */
export interface TabSelectEvent {
	/** The selected tab item */
	tab: TabItem;
	/** Index of the selected tab */
	index: number;
	/** Previously selected tab (if any) */
	previousTab?: TabItem;
	/** Index of previously selected tab */
	previousIndex?: number;
}

/**
 * Event emitted when a tab is closed
 */
export interface TabCloseEvent {
	/** The tab item being closed */
	tab: TabItem;
	/** Index of the tab being closed */
	index: number;
	/** Prevent default close behavior */
	preventDefault?: () => void;
}

/**
 * Event emitted when tab order changes (for reorderable tabs)
 */
export interface TabReorderEvent {
	/** The moved tab item */
	tab: TabItem;
	/** Previous index */
	previousIndex: number;
	/** New index */
	currentIndex: number;
}
