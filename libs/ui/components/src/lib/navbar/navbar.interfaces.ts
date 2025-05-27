
export interface NavbarData {
	brand?: {
		text?: string;
		icon?: string;
		logoUrl?: string;
		href?: string;
	};
	navigation?: NavbarNavigationItem[];
	actions?: NavbarAction[];
	user?: NavbarUser;
	search?: {
		placeholder?: string;
		value?: string;
	};
}

export interface NavbarNavigationItem {
	label: string;
	href?: string;
	icon?: string;
	active?: boolean;
	disabled?: boolean;
	children?: NavbarNavigationItem[];
	external?: boolean;
	badge?: {
		text: string;
		color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
	};
}

export interface NavbarAction {
	type: 'button' | 'link' | 'dropdown';
	label: string;
	icon?: string;
	href?: string;
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
	disabled?: boolean;
	items?: NavbarDropdownItem[];
	badge?: {
		text: string;
		color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
	};
}

export interface NavbarDropdownItem {
	label?: string;
	href?: string;
	icon?: string;
	disabled?: boolean;
	divider?: boolean;
	action?: 'logout' | 'settings' | 'profile' | 'custom';
}

export interface NavbarUser {
	name: string;
	email?: string;
	avatar?: string;
	initials?: string;
	status?: 'online' | 'offline' | 'busy' | 'away';
}

export interface NavbarConfig {
	variant?: 'default' | 'transparent' | 'blur';
	position?: 'static' | 'sticky' | 'fixed';
	size?: 'sm' | 'md' | 'lg';
	bordered?: boolean;
	shadow?: boolean;
	maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
	hideOnScroll?: boolean;
	blurBackground?: boolean;
	mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface NavbarEvents {
	onNavigate?: (item: NavbarNavigationItem) => void;
	onAction?: (action: NavbarAction) => void;
	onUserAction?: (action: NavbarDropdownItem) => void;
	onSearch?: (query: string) => void;
	onMobileToggle?: (isOpen: boolean) => void;
}
