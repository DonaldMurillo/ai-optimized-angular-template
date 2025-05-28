import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { 
	ModalComponent, 
	NavbarComponent, 
	BreadcrumbComponent, 
	TabsComponent,
	BreadcrumbConfig,
	BreadcrumbItem,
	TabCloseEvent,
	TabItem,
	TabsConfig,
	TabSelectEvent,
	NavbarAction,
	NavbarDropdownItem,
	NavbarNavigationItem,
	NavbarData,
	NavbarConfig
} from '@ui/components';

@Component({
	selector: 'ui-layout-showcase-widget',
	standalone: true,
	imports: [
		ModalComponent,
		NavbarComponent,
		BreadcrumbComponent,
		TabsComponent
	],
	host: {
		class: 'block'
	},
	template: `
		<section id="layout" class="scroll-mt-24">
			<div class="text-center mb-12">
				<div class="inline-flex items-center gap-3 mb-4">
					<span class="text-2xl">📱</span>
					<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Layout Components
					</h2>
				</div>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Essential layout and navigation components for building structured user interfaces
				</p>
			</div>
			
			<div class="grid grid-cols-1 gap-8">
				<!-- Modal Components -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Modal Dialogs</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Different Sizes</h4>
							<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
								@for (modal of modalSizes(); track modal.size) {
									<button 
										(click)="showModal(modal.size)"
										class="px-4 py-2 text-white rounded transition-colors text-sm"
										[class]="getModalButtonClass(modal.size)">
										{{ modal.label }}
									</button>
								}
							</div>
						</div>
						<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modal Features</h4>
							<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
								<li>• Accessible with ARIA attributes and keyboard navigation</li>
								<li>• Click outside to dismiss or use the close button</li>
								<li>• Smooth animations with backdrop blur effect</li>
								<li>• Focus management and body scroll prevention</li>
								<li>• Dark mode support with proper color schemes</li>
								<li>• Multiple sizes: Small (384px), Medium (512px), Large (640px), XL (768px)</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Breadcrumb Components -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-amber-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Breadcrumb Navigation</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Navigation Hierarchy Examples</h4>
							
							@for (breadcrumb of breadcrumbExamples(); track breadcrumb.title) {
								<div class="mb-6">
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ breadcrumb.title }}</p>
									<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
										<ui-breadcrumb 
											[config]="breadcrumb.config"
											[items]="breadcrumb.items"
											(itemClick)="handleBreadcrumbClick($event)">
										</ui-breadcrumb>
									</div>
								</div>
							}
						</div>
						
						<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Breadcrumb Features</h4>
							<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
								<li>• Hierarchical navigation with customizable separators</li>
								<li>• Overflow handling for long navigation paths</li>
								<li>• Icon support for visual clarity</li>
								<li>• Multiple style variants: default, simple, pills, minimal</li>
								<li>• Home icon support for first navigation item</li>
								<li>• Responsive design with mobile optimization</li>
								<li>• Dark mode support with automatic theming</li>
								<li>• Accessibility with semantic navigation and ARIA labels</li>
								<li>• Keyboard navigation support</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Tabs Components -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-purple-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Tabs Component</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tab Examples</h4>
							
							@for (tabExample of tabExamples(); track tabExample.title) {
								<div class="mb-6">
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ tabExample.title }}</p>
									<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
										<ui-tabs 
											[tabs]="tabExample.tabs"
											[config]="tabExample.config"
											(tabSelect)="handleTabSelect($event)"
											(tabClose)="handleTabClose($event)">
											
											@for (tab of tabExample.tabs; track tab.id) {
												<div [attr.slot]="'tab-' + tab.id" class="p-6">
													<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
														{{ tab.icon }} {{ tab.label }} Content
													</h3>
													<p class="text-gray-600 dark:text-gray-400">
														This is the content for the {{ tab.label }} tab. Each tab can contain any HTML content, forms, widgets, or complex layouts.
													</p>
													@if (tab.id === 'overview') {
														<div class="grid grid-cols-2 gap-4 mt-4">
															<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
																<h4 class="font-medium text-blue-700 dark:text-blue-300">Total Users</h4>
																<p class="text-2xl font-bold text-blue-900 dark:text-blue-100">2,847</p>
															</div>
															<div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
																<h4 class="font-medium text-green-700 dark:text-green-300">Revenue</h4>
																<p class="text-2xl font-bold text-green-900 dark:text-green-100">$45,231</p>
															</div>
														</div>
													}
												</div>
											}
										</ui-tabs>
									</div>
								</div>
							}
						</div>
						
						<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tab Features</h4>
							<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
								<li>• Multiple style variants: default, pills, underline, bordered, minimal</li>
								<li>• Horizontal and vertical orientations with responsive design</li>
								<li>• Icon and badge support for enhanced visual communication</li>
								<li>• Closable tabs with customizable close buttons</li>
								<li>• Disabled tabs and lazy loading support</li>
								<li>• Keyboard navigation with arrow keys and shortcuts</li>
								<li>• Smooth animations and transitions</li>
								<li>• Dark mode support with automatic theming</li>
								<li>• Accessibility with ARIA roles and proper focus management</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Navbar Components -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Navigation Bars</h3>
					</div>
					<div class="space-y-6">
						<div>
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Responsive Navbar Examples</h4>
							
							@for (navbar of navbarExamples(); track navbar.title) {
								<div class="mb-6">
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ navbar.description }}</p>
									<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
										<ui-navbar 
											[data]="navbar.data"
											[config]="navbar.config"
											(onNavigate)="handleNavigation($event)"
											(onAction)="handleAction($event)"
											(onUserAction)="handleUserAction($event)"
											(onSearch)="handleSearch($event)">
										</ui-navbar>
									</div>
								</div>
							}
						</div>
						
						<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Navbar Features</h4>
							<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
								<li>• Fully responsive with mobile-first design</li>
								<li>• Collapsible mobile menu with smooth animations</li>
								<li>• Dropdown navigation with nested menu support</li>
								<li>• Integrated search functionality</li>
								<li>• User profile dropdown with status indicators</li>
								<li>• Action buttons and notification badges</li>
								<li>• Dark mode support with automatic color switching</li>
								<li>• Accessibility with ARIA labels and keyboard navigation</li>
								<li>• Multiple variants: default, transparent, blur effects</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Container -->
			@if (showingModal()) {
				<ui-modal 
					[isOpen]="showingModal()"
					[title]="modalData().title || ''"
					[content]="modalData().content"
					[size]="modalData().size"
					[closable]="true"
					[closeOnBackdrop]="true"
					(onClose)="hideModal()">
				</ui-modal>
			}
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutShowcaseWidget {
	// Internal state
	showingModal = signal(false);
	modalData = signal<{
		title?: string;
		content: string;
		size: 'sm' | 'md' | 'lg' | 'xl';
	}>({
		title: 'Sample Modal',
		content: 'This is a demonstration of the modal component with various features.',
		size: 'md'
	});

	// Built-in data signals
	modalSizes = signal([
		{ size: 'sm' as const, label: 'Small', description: 'Compact modal for simple actions' },
		{ size: 'md' as const, label: 'Medium', description: 'Default modal size for most content' },
		{ size: 'lg' as const, label: 'Large', description: 'Spacious modal for complex forms' },
		{ size: 'xl' as const, label: 'Extra Large', description: 'Maximum modal size for dashboards' }
	]);

	// Demo data for breadcrumbs - using correct interface properties
	breadcrumbExamples = signal([
		{
			title: 'Simple Navigation',
			items: [
				{ label: 'Home', url: '/', icon: '🏠' },
				{ label: 'Products', url: '/products' },
				{ label: 'Electronics', url: '/products/electronics' },
				{ label: 'Smartphones', disabled: true }
			] as BreadcrumbItem[],
			config: {
				separator: 'slash' as const,
				showIcons: true,
				variant: 'default' as const
			} as BreadcrumbConfig
		},
		{
			title: 'E-commerce Path',
			items: [
				{ label: 'Store', url: '/', icon: '🏪' },
				{ label: 'Categories', url: '/categories' },
				{ label: 'Technology', url: '/categories/technology' },
				{ label: 'Computers', url: '/categories/technology/computers' },
				{ label: 'Laptops', url: '/categories/technology/computers/laptops' },
				{ label: 'Gaming Laptops', url: '/categories/technology/computers/laptops/gaming' },
				{ label: 'High Performance', disabled: true }
			] as BreadcrumbItem[],
			config: {
				separator: 'chevron' as const,
				maxItems: 4,
				variant: 'pills' as const
			} as BreadcrumbConfig
		},
		{
			title: 'Dashboard Navigation',
			items: [
				{ label: 'Dashboard', url: '/dashboard', icon: '📊' },
				{ label: 'Analytics', url: '/dashboard/analytics' },
				{ label: 'Reports', disabled: true }
			] as BreadcrumbItem[],
			config: {
				separator: 'dot' as const,
				variant: 'minimal' as const,
				size: 'lg' as const
			} as BreadcrumbConfig
		}
	]);

	// Demo data for tabs - using correct interface properties
	tabExamples = signal([
		{
			title: 'Basic Tabs with Icons and Badges',
			tabs: [
				{
					id: 'overview',
					label: 'Overview',
					icon: '📊',
					badge: '5'
				},
				{
					id: 'details',
					label: 'Details',
					icon: '📋'
				},
				{
					id: 'settings',
					label: 'Settings',
					icon: '⚙️',
					badge: 'New'
				}
			] as TabItem[],
			config: {
				variant: 'default' as const,
				orientation: 'horizontal' as const,
				size: 'md' as const
			} as TabsConfig
		},
		{
			title: 'Pills Style with Closable Tabs',
			tabs: [
				{
					id: 'analytics',
					label: 'Analytics',
					icon: '📈',
					closable: true
				},
				{
					id: 'reports',
					label: 'Reports',
					icon: '📊',
					closable: true,
					badge: '3'
				},
				{
					id: 'users',
					label: 'Users',
					icon: '👥',
					closable: true
				},
				{
					id: 'api',
					label: 'API',
					icon: '🔌',
					closable: true,
					disabled: true
				}
			] as TabItem[],
			config: {
				variant: 'pills' as const,
				orientation: 'horizontal' as const,
				size: 'sm' as const
			} as TabsConfig
		},
		{
			title: 'Vertical Tabs Layout',
			tabs: [
				{
					id: 'profile',
					label: 'Profile',
					icon: '👤'
				},
				{
					id: 'account',
					label: 'Account',
					icon: '🏦'
				},
				{
					id: 'security',
					label: 'Security',
					icon: '🔒',
					badge: '!'
				},
				{
					id: 'billing',
					label: 'Billing',
					icon: '💳'
				},
				{
					id: 'notifications',
					label: 'Notifications',
					icon: '🔔'
				}
			] as TabItem[],
			config: {
				variant: 'underline' as const,
				orientation: 'vertical' as const,
				size: 'md' as const
			} as TabsConfig
		}
	]);

	// Navbar examples - using correct interface properties
	navbarExamples = signal([
		{
			title: 'Modern SaaS Navbar',
			description: 'Clean navigation with user profile',
			data: {
				brand: {
					text: 'AppStudio',
					icon: '🚀',
					href: '/'
				},
				navigation: [
					{ label: 'Dashboard', href: '/dashboard', active: true },
					{ label: 'Projects', href: '/projects' },
					{ label: 'Team', href: '/team' }
				],
				actions: [
					{
						type: 'button' as const,
						label: 'New Project',
						variant: 'primary' as const,
						icon: '➕'
					}
				],
				user: {
					name: 'John Doe',
					email: 'john@example.com',
					initials: 'JD',
					status: 'online' as const
				}
			} as NavbarData,
			config: {
				variant: 'default' as const,
				position: 'static' as const,
				bordered: true
			} as NavbarConfig
		},
		{
			title: 'E-commerce Navbar',
			description: 'Shopping-focused navigation with actions',
			data: {
				brand: {
					text: 'ShopHub',
					icon: '🛍️',
					href: '/'
				},
				navigation: [
					{ label: 'Categories', href: '/categories' },
					{ label: 'Deals', href: '/deals', badge: { text: 'Hot', color: 'red' } },
					{ label: 'New Arrivals', href: '/new' },
					{ label: 'Brands', href: '/brands' }
				],
				actions: [
					{
						type: 'button' as const,
						label: 'Cart',
						icon: '🛒',
						badge: { text: '2', color: 'blue' }
					}
				],
				user: {
					name: 'Sarah Wilson',
					email: 'sarah@example.com',
					initials: 'SW'
				}
			} as NavbarData,
			config: {
				variant: 'default' as const,
				position: 'static' as const,
				bordered: true
			} as NavbarConfig
		}
	]);

	getModalButtonClass(size: string): string {
		const classes = {
			sm: 'bg-indigo-500 hover:bg-indigo-600',
			md: 'bg-blue-500 hover:bg-blue-600',
			lg: 'bg-purple-500 hover:bg-purple-600',
			xl: 'bg-teal-500 hover:bg-teal-600'
		};
		return classes[size as keyof typeof classes] || classes.md;
	}

	// Event handlers
	showModal(size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): void {
		const modalContent = {
			sm: {
				title: 'Small Modal',
				content: 'This is a small modal dialog for simple confirmations or brief messages. Perfect for quick actions and notifications.'
			},
			md: {
				title: 'Medium Modal',
				content: 'This is a medium-sized modal dialog that provides more space for content and actions. Ideal for forms and detailed information.'
			},
			lg: {
				title: 'Large Modal',
				content: 'This is a large modal dialog with plenty of space for complex content, multiple sections, or extensive forms. Great for comprehensive interfaces.'
			},
			xl: {
				title: 'Extra Large Modal',
				content: 'This is an extra large modal dialog designed for comprehensive content, detailed dashboards, or complex interfaces that need maximum screen real estate.'
			}
		};

		this.modalData.set({
			...modalContent[size],
			size
		});
		this.showingModal.set(true);
	}

	hideModal(): void {
		this.showingModal.set(false);
	}

	handleTabSelect(event: TabSelectEvent): void {
		console.log('Tab selected:', event);
	}

	handleTabClose(event: TabCloseEvent): void {
		console.log('Tab closed:', event);
	}

	handleBreadcrumbClick(item: BreadcrumbItem): void {
		console.log('Breadcrumb clicked:', item);
	}

	handleNavigation(item: NavbarNavigationItem): void {
		console.log('Navigation clicked:', item);
	}

	handleAction(action: NavbarAction): void {
		console.log('Action clicked:', action);
	}

	handleUserAction(item: NavbarDropdownItem): void {
		console.log('User action clicked:', item);
	}

	handleSearch(query: string): void {
		console.log('Search query:', query);
	}
}
