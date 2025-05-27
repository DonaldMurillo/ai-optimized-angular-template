
import { Component, ChangeDetectionStrategy, signal, computed, input, output, effect, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { 
	NavbarData, 
	NavbarConfig, 
	NavbarNavigationItem, 
	NavbarAction, 
	NavbarDropdownItem
} from './navbar.interfaces';

@Component({
	selector: 'ui-navbar',
	standalone: true,
	imports: [CommonModule, BadgeComponent, ButtonComponent],
	host: {
		class: 'block w-full'
	},
	template: `
		<nav 
			class="navbar-container transition-all duration-300 ease-in-out"
			[class]="navbarClasses()"
			[attr.role]="'navigation'"
			[attr.aria-label]="'Main navigation'">
			
			<div class="navbar-wrapper" [class]="wrapperClasses()">
				<!-- Brand Section -->
				@if (data().brand; as brand) {
					<div class="navbar-brand flex items-center">
						@if (brand.href) {
							<a 
								[href]="brand.href"
								class="flex items-center gap-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
								(click)="handleBrandClick($event, brand)">
								@if (brand.logoUrl) {
									<img 
										[src]="brand.logoUrl" 
										[alt]="brand.text || 'Logo'"
										class="h-8 w-8 object-contain">
								} @else if (brand.icon) {
									<span class="text-2xl">{{ brand.icon }}</span>
								}
								@if (brand.text) {
									<span class="font-bold text-xl">{{ brand.text }}</span>
								}
							</a>
						} @else {
							<div class="flex items-center gap-3 text-gray-900 dark:text-gray-100">
								@if (brand.logoUrl) {
									<img 
										[src]="brand.logoUrl" 
										[alt]="brand.text || 'Logo'"
										class="h-8 w-8 object-contain">
								} @else if (brand.icon) {
									<span class="text-2xl">{{ brand.icon }}</span>
								}
								@if (brand.text) {
									<span class="font-bold text-xl">{{ brand.text }}</span>
								}
							</div>
						}
					</div>
				}

				<!-- Desktop Navigation -->
				@if (data().navigation?.length) {
					<div class="navbar-nav hidden" [class]="desktopNavClasses()">
						@for (item of data().navigation; track item.label) {
							<div class="navbar-nav-item" [class]="getNavItemClasses(item)">
								@if (item.children?.length) {
									<!-- Dropdown Navigation Item -->
									<div class="relative dropdown-container">
										<button 
											class="nav-link dropdown-toggle flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
											[class]="getNavLinkClasses(item)"
											(click)="toggleDropdown(item.label)"
											(keydown.enter)="toggleDropdown(item.label)"
											(keydown.space)="$event.preventDefault(); toggleDropdown(item.label)"
											[attr.aria-expanded]="isDropdownOpen(item.label)"
											[attr.aria-haspopup]="'true'">
											@if (item.icon) {
												<span class="text-sm">{{ item.icon }}</span>
											}
											<span>{{ item.label }}</span>
											<svg class="w-4 h-4 transition-transform duration-200" 
												[class.rotate-180]="isDropdownOpen(item.label)"
												fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
											</svg>
											@if (item.badge) {
												<ui-badge 
													[data]="{ text: item.badge.text }"
													[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
												</ui-badge>
											}
										</button>
										
										@if (isDropdownOpen(item.label)) {
											<div class="dropdown-menu absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in-0 zoom-in-95">
												@for (child of item.children; track child.label) {
													@if (child.href) {
														<a 
															[href]="child.href"
															class="dropdown-item flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
															[class.opacity-50]="child.disabled"
															[class.pointer-events-none]="child.disabled"
															(click)="handleNavigation(child, $event)">
															@if (child.icon) {
																<span class="text-sm">{{ child.icon }}</span>
															}
															<span>{{ child.label }}</span>
														</a>
													} @else {
														<button 
															class="dropdown-item w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
															[class.opacity-50]="child.disabled"
															[disabled]="child.disabled"
															(click)="handleNavigation(child, $event)">
															@if (child.icon) {
																<span class="text-sm">{{ child.icon }}</span>
															}
															<span>{{ child.label }}</span>
														</button>
													}
												}
											</div>
										}
									</div>
								} @else {
									<!-- Regular Navigation Item -->
									@if (item.href) {
										<a 
											[href]="item.href"
											class="nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
											[class]="getNavLinkClasses(item)"
											[class.opacity-50]="item.disabled"
											[class.pointer-events-none]="item.disabled"
											[target]="item.external ? '_blank' : undefined"
											[rel]="item.external ? 'noopener noreferrer' : undefined"
											(click)="handleNavigation(item, $event)">
											@if (item.icon) {
												<span class="text-sm">{{ item.icon }}</span>
											}
											<span>{{ item.label }}</span>
											@if (item.badge) {
												<ui-badge 
													[data]="{ text: item.badge.text }"
													[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
												</ui-badge>
											}
											@if (item.external) {
												<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
												</svg>
											}
										</a>
									} @else {
										<button 
											class="nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
											[class]="getNavLinkClasses(item)"
											[class.opacity-50]="item.disabled"
											[disabled]="item.disabled"
											(click)="handleNavigation(item, $event)">
											@if (item.icon) {
												<span class="text-sm">{{ item.icon }}</span>
											}
											<span>{{ item.label }}</span>
											@if (item.badge) {
												<ui-badge 
													[data]="{ text: item.badge.text }"
													[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
												</ui-badge>
											}
										</button>
									}
								}
							</div>
						}
					</div>
				}

				<!-- Search Bar -->
				@if (data().search) {
					<div class="navbar-search hidden lg:flex items-center">
						<div class="relative">
							<input 
								type="text"
								[placeholder]="data().search?.placeholder || 'Search...'"
								[value]="searchQuery()"
								(input)="handleSearchInput($event)"
								(keydown.enter)="handleSearchSubmit()"
								class="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
									   text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
									   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
							<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" 
								 fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
							</svg>
						</div>
					</div>
				}

				<!-- Actions & User Section -->
				<div class="navbar-actions flex items-center gap-3">
					<!-- Action Buttons -->
					@if (data().actions?.length) {
						<div class="hidden md:flex items-center gap-2">
							@for (action of data().actions; track action.label) {
								@if (action.type === 'button') {
									<ui-button 
										[data]="{ text: action.label, icon: action.icon }"
										[config]="{ 
											variant: (action.variant === 'danger' ? 'secondary' : action.variant) || 'secondary', 
											size: getButtonSize(),
											disabled: action.disabled 
										}"
										(click)="handleAction(action)">
									</ui-button>
								} @else if (action.type === 'link') {
									<a 
										[href]="action.href || '#'"
										class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
										[class]="getActionLinkClasses(action)"
										(click)="handleAction(action)">
										@if (action.icon) {
											<span class="text-sm">{{ action.icon }}</span>
										}
										<span>{{ action.label }}</span>
									</a>
								} @else if (action.type === 'dropdown') {
									<div class="relative">
										<button 
											class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
											[class]="getActionButtonClasses(action)"
											(click)="toggleActionDropdown(action.label)"
											[attr.aria-expanded]="isActionDropdownOpen(action.label)">
											@if (action.icon) {
												<span class="text-sm">{{ action.icon }}</span>
											}
											<span>{{ action.label }}</span>
											<svg class="w-4 h-4 transition-transform duration-200" 
												[class.rotate-180]="isActionDropdownOpen(action.label)"
												fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
											</svg>
										</button>
										
										@if (isActionDropdownOpen(action.label)) {
											<div class="dropdown-menu absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in-0 zoom-in-95">
												@for (item of action.items; track item.label) {
													@if (item.divider) {
														<div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
													} @else {
														@if (item.href) {
															<a 
																[href]="item.href"
																class="dropdown-item flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
																[class.opacity-50]="item.disabled"
																[class.pointer-events-none]="item.disabled"
																(click)="handleUserAction(item)">
																@if (item.icon) {
																	<span class="text-sm">{{ item.icon }}</span>
																}
																<span>{{ item.label }}</span>
															</a>
														} @else {
															<button 
																class="dropdown-item w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
																[class.opacity-50]="item.disabled"
																[disabled]="item.disabled"
																(click)="handleUserAction(item)">
																@if (item.icon) {
																	<span class="text-sm">{{ item.icon }}</span>
																}
																<span>{{ item.label }}</span>
															</button>
														}
													}
												}
											</div>
										}
									</div>
								}
							}
						</div>
					}

					<!-- User Profile -->
					@if (data().user; as user) {
						<div class="user-profile relative">
							<button 
								class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
								(click)="toggleUserDropdown()"
								[attr.aria-expanded]="isUserDropdownOpen()">
								<div class="relative">
									@if (user.avatar) {
										<img 
											[src]="user.avatar" 
											[alt]="user.name"
											class="w-8 h-8 rounded-full object-cover">
									} @else {
										<div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
											{{ user.initials || user.name.charAt(0).toUpperCase() }}
										</div>
									}
									@if (user.status) {
										<div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
											 [class]="getStatusClasses(user.status)">
										</div>
									}
								</div>
								<div class="hidden md:block text-left">
									<div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
									@if (user.email) {
										<div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
									}
								</div>
								<svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" 
									[class.rotate-180]="isUserDropdownOpen()"
									fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
								</svg>
							</button>

							@if (isUserDropdownOpen()) {
								<div class="user-dropdown absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in-0 zoom-in-95">
									<!-- User Info Header -->
									<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
										<div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
										@if (user.email) {
											<div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
										}
									</div>
									
									<!-- Default User Actions -->
									<button 
										class="dropdown-item w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
										(click)="handleUserAction({ label: 'Profile', action: 'profile', icon: '👤' })">
										<span class="text-sm">👤</span>
										<span>Profile</span>
									</button>
									<button 
										class="dropdown-item w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
										(click)="handleUserAction({ label: 'Settings', action: 'settings', icon: '⚙️' })">
										<span class="text-sm">⚙️</span>
										<span>Settings</span>
									</button>
									<div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
									<button 
										class="dropdown-item w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-left"
										(click)="handleUserAction({ label: 'Sign Out', action: 'logout', icon: '🚪' })">
										<span class="text-sm">🚪</span>
										<span>Sign Out</span>
									</button>
								</div>
							}
						</div>
					}

					<!-- Mobile Menu Toggle -->
					<button 
						class="mobile-menu-toggle p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
						[class]="mobileToggleClasses()"
						(click)="toggleMobileMenu()"
						[attr.aria-expanded]="isMobileMenuOpen()"
						[attr.aria-label]="'Toggle mobile menu'">
						<svg class="w-6 h-6 transition-transform duration-200" 
							[class.rotate-90]="isMobileMenuOpen()"
							fill="none" stroke="currentColor" viewBox="0 0 24 24">
							@if (isMobileMenuOpen()) {
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							} @else {
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
							}
						</svg>
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			@if (isMobileMenuOpen()) {
				<div class="mobile-menu border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-in slide-in-from-top-2 duration-200"
					 [class]="mobileMenuClasses()">
					<div class="px-4 py-4 space-y-2">
						<!-- Mobile Search -->
						@if (data().search) {
							<div class="mb-4">
								<div class="relative">
									<input									type="text"
									[placeholder]="data().search?.placeholder || 'Search...'"
									[value]="searchQuery()"
										(input)="handleSearchInput($event)"
										(keydown.enter)="handleSearchSubmit()"
										class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg 
											   text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
											   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
									<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" 
										 fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
									</svg>
								</div>
							</div>
						}

						<!-- Mobile Navigation -->
						@if (data().navigation?.length) {
							@for (item of data().navigation; track item.label) {
								@if (item.children?.length) {
									<!-- Mobile Dropdown Item -->
									<div class="mobile-nav-item">
										<button 
											class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
											(click)="toggleMobileDropdown(item.label)">
											<div class="flex items-center gap-3">
												@if (item.icon) {
													<span class="text-lg">{{ item.icon }}</span>
												}
												<span class="font-medium text-gray-900 dark:text-gray-100">{{ item.label }}</span>
												@if (item.badge) {
													<ui-badge 
														[data]="{ text: item.badge.text }"
														[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
													</ui-badge>
												}
											</div>
											<svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" 
												[class.rotate-180]="isMobileDropdownOpen(item.label)"
												fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
											</svg>
										</button>
										
										@if (isMobileDropdownOpen(item.label)) {
											<div class="ml-6 mt-2 space-y-1 animate-in slide-in-from-top-1">
												@for (child of item.children; track child.label) {
													@if (child.href) {
														<a 
															[href]="child.href"
															class="flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
															[class.opacity-50]="child.disabled"
															[class.pointer-events-none]="child.disabled"
															(click)="handleNavigation(child, $event); closeMobileMenu()">
															@if (child.icon) {
																<span class="text-sm">{{ child.icon }}</span>
															}
															<span>{{ child.label }}</span>
														</a>
													} @else {
														<button 
															class="w-full flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
															[class.opacity-50]="child.disabled"
															[disabled]="child.disabled"
															(click)="handleNavigation(child, $event); closeMobileMenu()">
															@if (child.icon) {
																<span class="text-sm">{{ child.icon }}</span>
															}
															<span>{{ child.label }}</span>
														</button>
													}
												}
											</div>
										}
									</div>
								} @else {
									<!-- Mobile Regular Item -->
									@if (item.href) {
										<a 
											[href]="item.href"
											class="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200"
											[class]="getMobileNavLinkClasses(item)"
											[class.opacity-50]="item.disabled"
											[class.pointer-events-none]="item.disabled"
											[target]="item.external ? '_blank' : undefined"
											[rel]="item.external ? 'noopener noreferrer' : undefined"
											(click)="handleNavigation(item, $event); closeMobileMenu()">
											@if (item.icon) {
												<span class="text-lg">{{ item.icon }}</span>
											}
											<span class="font-medium">{{ item.label }}</span>
											@if (item.badge) {
												<ui-badge 
													[data]="{ text: item.badge.text }"
													[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
												</ui-badge>
											}
											@if (item.external) {
												<svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
												</svg>
											}
										</a>
									} @else {
										<button 
											class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 text-left"
											[class]="getMobileNavLinkClasses(item)"
											[class.opacity-50]="item.disabled"
											[disabled]="item.disabled"
											(click)="handleNavigation(item, $event); closeMobileMenu()">
											@if (item.icon) {
												<span class="text-lg">{{ item.icon }}</span>
											}
											<span class="font-medium">{{ item.label }}</span>
											@if (item.badge) {
												<ui-badge 
													[data]="{ text: item.badge.text }"
													[config]="{ variant: 'status', color: item.badge.color || 'blue', size: 'sm' }">
												</ui-badge>
											}
										</button>
									}
								}
							}
						}

						<!-- Mobile Actions -->
						@if (data().actions?.length) {
							<div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
								<div class="space-y-2">
									@for (action of data().actions; track action.label) {
										@if (action.type === 'button') {
											<ui-button 
												[data]="{ text: action.label, icon: action.icon }"
												[config]="{ 
													variant: (action.variant === 'danger' ? 'secondary' : action.variant) || 'secondary', 
													size: 'md',
													disabled: action.disabled 
												}"
												class="w-full"
												(click)="handleAction(action); closeMobileMenu()">
											</ui-button>
										} @else if (action.type === 'link') {
											<a 
												[href]="action.href || '#'"
												class="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
												(click)="handleAction(action); closeMobileMenu()">
												@if (action.icon) {
													<span class="text-lg">{{ action.icon }}</span>
												}
												<span class="font-medium">{{ action.label }}</span>
											</a>
										}
									}
								</div>
							</div>
						}
					</div>
				</div>
			}
		</nav>

		<!-- Backdrop for mobile menu -->
		@if (isMobileMenuOpen()) {
			<div 
				class="fixed inset-0 bg-black bg-opacity-50 z-40 animate-in fade-in-0 duration-200"
				(click)="closeMobileMenu()"
				[attr.aria-hidden]="'true'">
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
	// Inputs
	data = input.required<NavbarData>();
	config = input<NavbarConfig>({});

	// Outputs
	onNavigate = output<NavbarNavigationItem>();
	onAction = output<NavbarAction>();
	onUserAction = output<NavbarDropdownItem>();
	onSearch = output<string>();
	onMobileToggle = output<boolean>();

	// Internal state
	private document = inject(DOCUMENT);
	private openDropdowns = signal<Set<string>>(new Set());
	private openActionDropdowns = signal<Set<string>>(new Set());
	private userDropdownOpen = signal(false);
	private mobileMenuOpen = signal(false);
	private mobileOpenDropdowns = signal<Set<string>>(new Set());
	searchQuery = signal('');

	// Computed properties for classes
	navbarClasses = computed(() => {
		const config = this.config();
		const classes = ['navbar-container'];

		// Position
		switch (config.position) {
			case 'sticky':
				classes.push('sticky top-0 z-50');
				break;
			case 'fixed':
				classes.push('fixed top-0 left-0 right-0 z-50');
				break;
			default:
				classes.push('relative');
		}

		// Variant
		switch (config.variant) {
			case 'transparent':
				classes.push('bg-transparent');
				break;
			case 'blur':
				classes.push('bg-white/80 dark:bg-gray-900/80 backdrop-blur-md');
				break;
			default:
				classes.push('bg-white dark:bg-gray-900');
		}

		// Border and shadow
		if (config.bordered !== false) {
			classes.push('border-b border-gray-200 dark:border-gray-700');
		}
		if (config.shadow !== false) {
			classes.push('shadow-sm');
		}

		return classes.join(' ');
	});

	wrapperClasses = computed(() => {
		const config = this.config();
		const classes = ['navbar-wrapper', 'flex items-center justify-between'];

		// Size
		switch (config.size) {
			case 'sm':
				classes.push('h-14 px-4');
				break;
			case 'lg':
				classes.push('h-20 px-8');
				break;
			default:
				classes.push('h-16 px-6');
		}

		// Max width
		const maxWidth = config.maxWidth || 'full';
		if (maxWidth !== 'none') {
			classes.push('mx-auto');
			if (maxWidth !== 'full') {
				classes.push(`max-w-${maxWidth}`);
			}
		}

		return classes.join(' ');
	});

	desktopNavClasses = computed(() => {
		const config = this.config();
		const breakpoint = config.mobileBreakpoint || 'lg';
		return `${breakpoint}:flex items-center gap-1`;
	});

	mobileToggleClasses = computed(() => {
		const config = this.config();
		const breakpoint = config.mobileBreakpoint || 'lg';
		return `${breakpoint}:hidden`;
	});

	mobileMenuClasses = computed(() => {
		const config = this.config();
		const breakpoint = config.mobileBreakpoint || 'lg';
		return `${breakpoint}:hidden`;
	});

	// Effects
	constructor() {
		effect(() => {
			const searchValue = this.data()?.search?.value;
			if (searchValue !== undefined) {
				this.searchQuery.set(searchValue);
			}
		});

		// Close dropdowns when clicking outside
		effect(() => {
			const handleClickOutside = (event: Event) => {
				const target = event.target as Element;
				if (!target.closest('.dropdown-container') && !target.closest('.user-profile')) {
					this.closeAllDropdowns();
				}
			};

			this.document.addEventListener('click', handleClickOutside);
			return () => this.document.removeEventListener('click', handleClickOutside);
		});

		// Handle escape key
		effect(() => {
			const handleEscape = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					this.closeAllDropdowns();
					this.closeMobileMenu();
				}
			};

			this.document.addEventListener('keydown', handleEscape);
			return () => this.document.removeEventListener('keydown', handleEscape);
		});
	}

	// Dropdown state methods
	isDropdownOpen(label: string): boolean {
		return this.openDropdowns().has(label);
	}

	isActionDropdownOpen(label: string): boolean {
		return this.openActionDropdowns().has(label);
	}

	isUserDropdownOpen(): boolean {
		return this.userDropdownOpen();
	}

	isMobileMenuOpen(): boolean {
		return this.mobileMenuOpen();
	}

	isMobileDropdownOpen(label: string): boolean {
		return this.mobileOpenDropdowns().has(label);
	}

	// Toggle methods
	toggleDropdown(label: string): void {
		this.openDropdowns.update(dropdowns => {
			const newDropdowns = new Set(dropdowns);
			if (newDropdowns.has(label)) {
				newDropdowns.delete(label);
			} else {
				newDropdowns.clear();
				newDropdowns.add(label);
			}
			return newDropdowns;
		});
	}

	toggleActionDropdown(label: string): void {
		this.openActionDropdowns.update(dropdowns => {
			const newDropdowns = new Set(dropdowns);
			if (newDropdowns.has(label)) {
				newDropdowns.delete(label);
			} else {
				newDropdowns.clear();
				newDropdowns.add(label);
			}
			return newDropdowns;
		});
	}

	toggleUserDropdown(): void {
		this.userDropdownOpen.update(open => !open);
	}

	toggleMobileMenu(): void {
		this.mobileMenuOpen.update(open => {
			const newOpen = !open;
			this.onMobileToggle.emit(newOpen);
			return newOpen;
		});
	}

	toggleMobileDropdown(label: string): void {
		this.mobileOpenDropdowns.update(dropdowns => {
			const newDropdowns = new Set(dropdowns);
			if (newDropdowns.has(label)) {
				newDropdowns.delete(label);
			} else {
				newDropdowns.add(label);
			}
			return newDropdowns;
		});
	}

	// Close methods
	closeAllDropdowns(): void {
		this.openDropdowns.set(new Set());
		this.openActionDropdowns.set(new Set());
		this.userDropdownOpen.set(false);
	}

	closeMobileMenu(): void {
		this.mobileMenuOpen.set(false);
		this.mobileOpenDropdowns.set(new Set());
		this.onMobileToggle.emit(false);
	}

	// Event handlers
	handleBrandClick(event: Event, brand: NonNullable<NavbarData['brand']>): void {
		if (!brand.href) {
			event.preventDefault();
		}
	}

	handleNavigation(item: NavbarNavigationItem, event?: Event): void {
		if (item.disabled) {
			event?.preventDefault();
			return;
		}

		this.closeAllDropdowns();
		this.onNavigate.emit(item);

		if (!item.href && event) {
			event.preventDefault();
		}
	}

	handleAction(action: NavbarAction): void {
		if (action.disabled) return;

		this.closeAllDropdowns();
		this.onAction.emit(action);
	}

	handleUserAction(item: NavbarDropdownItem): void {
		if (item.disabled) return;

		this.closeAllDropdowns();
		this.onUserAction.emit(item);
	}

	handleSearchInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.searchQuery.set(target.value);
	}

	handleSearchSubmit(): void {
		this.onSearch.emit(this.searchQuery());
	}

	// Utility methods for CSS classes
	getNavItemClasses(item: NavbarNavigationItem): string {
		return item.disabled ? 'opacity-50 pointer-events-none' : '';
	}

	getNavLinkClasses(item: NavbarNavigationItem): string {
		const classes = ['text-gray-700 dark:text-gray-300'];
		
		if (item.active) {
			classes.push('bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300');
		} else {
			classes.push('hover:bg-gray-100 dark:hover:bg-gray-700');
		}

		return classes.join(' ');
	}

	getMobileNavLinkClasses(item: NavbarNavigationItem): string {
		const classes = ['text-gray-700 dark:text-gray-300'];
		
		if (item.active) {
			classes.push('bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300');
		} else {
			classes.push('hover:bg-gray-100 dark:hover:bg-gray-700');
		}

		return classes.join(' ');
	}

	getActionLinkClasses(action: NavbarAction): string {
		const classes = ['text-gray-700 dark:text-gray-300'];
		
		switch (action.variant) {
			case 'primary':
				classes.push('text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900');
				break;
			case 'danger':
				classes.push('text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900');
				break;
			default:
				classes.push('hover:bg-gray-100 dark:hover:bg-gray-700');
		}

		return classes.join(' ');
	}

	getActionButtonClasses(action: NavbarAction): string {
		const classes = ['text-gray-700 dark:text-gray-300'];
		
		switch (action.variant) {
			case 'primary':
				classes.push('text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900');
				break;
			case 'danger':
				classes.push('text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900');
				break;
			default:
				classes.push('hover:bg-gray-100 dark:hover:bg-gray-700');
		}

		return classes.join(' ');
	}

	getStatusClasses(status: NonNullable<NavbarData['user']>['status']): string {
		switch (status) {
			case 'online':
				return 'bg-green-500';
			case 'busy':
				return 'bg-red-500';
			case 'away':
				return 'bg-yellow-500';
			case 'offline':
			default:
				return 'bg-gray-500';
		}
	}

	getButtonSize(): 'sm' | 'md' | 'lg' {
		const config = this.config();
		switch (config.size) {
			case 'sm':
				return 'sm';
			case 'lg':
				return 'md';
			default:
				return 'sm';
		}
	}
}
