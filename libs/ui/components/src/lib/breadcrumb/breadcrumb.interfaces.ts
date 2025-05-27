import { TemplateRef } from '@angular/core';

export interface BreadcrumbItem {
	/** Label text for the breadcrumb item */
	label: string;
	/** URL or route for navigation (undefined for current page) */
	url?: string;
	/** Icon name or component to display */
	icon?: string | TemplateRef<unknown>;
	/** Whether this item is clickable */
	disabled?: boolean;
	/** Custom data associated with the item */
	data?: unknown;
}

export interface BreadcrumbConfig {
	/** Separator between breadcrumb items */
	separator?: BreadcrumbSeparator;
	/** Custom separator icon or text */
	customSeparator?: string | TemplateRef<unknown>;
	/** Maximum number of items to show before overflow */
	maxItems?: number;
	/** Show home icon for first item */
	showHomeIcon?: boolean;
	/** Size variant */
	size?: BreadcrumbSize;
	/** Style variant */
	variant?: BreadcrumbVariant;
	/** Whether to show icons */
	showIcons?: boolean;
	/** Custom CSS classes */
	customClasses?: {
		container?: string;
		list?: string;
		item?: string;
		link?: string;
		separator?: string;
		current?: string;
		overflow?: string;
	};
}

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow' | 'dash' | 'dot' | 'custom';

export type BreadcrumbSize = 'sm' | 'md' | 'lg';

export type BreadcrumbVariant = 'default' | 'simple' | 'pills' | 'minimal';

export interface BreadcrumbEvents {
	/** Emitted when a breadcrumb item is clicked */
	itemClick: BreadcrumbItem;
	/** Emitted when overflow menu is toggled */
	overflowToggle: boolean;
}
