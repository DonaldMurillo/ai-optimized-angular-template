import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
	theme: Theme;
	resolvedTheme: 'light' | 'dark';
	systemTheme: 'light' | 'dark';
}

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private readonly document = inject(DOCUMENT);
	private readonly localStorage = this.document.defaultView?.localStorage;
	private readonly storageKey = 'app-theme';
	
	private readonly _theme = signal<Theme>('system');
	private readonly _systemTheme = signal<'light' | 'dark'>('light');
	
	readonly theme = this._theme.asReadonly();
	readonly systemTheme = this._systemTheme.asReadonly();
	
	readonly resolvedTheme = computed(() => {
		const currentTheme = this._theme();
		return currentTheme === 'system' ? this._systemTheme() : currentTheme;
	});
	
	readonly themeState = computed<ThemeState>(() => ({
		theme: this._theme(),
		resolvedTheme: this.resolvedTheme(),
		systemTheme: this._systemTheme()
	}));
	
	constructor() {
		// Initialize system theme detection
		this.detectSystemTheme();
		
		// Load saved theme from localStorage
		this.loadSavedTheme();
		
		// Apply theme effect
		effect(() => {
			this.applyTheme(this.resolvedTheme());
		});
		
		// Listen for system theme changes
		this.setupSystemThemeListener();
	}
	
	setTheme(theme: Theme): void {
		this._theme.set(theme);
		this.saveTheme(theme);
	}
	
	toggleTheme(): void {
		const currentResolved = this.resolvedTheme();
		const newTheme = currentResolved === 'light' ? 'dark' : 'light';
		this.setTheme(newTheme);
	}
	
	private detectSystemTheme(): void {
		const defaultView = this.document.defaultView;
		if (defaultView && defaultView.matchMedia) {
			const mediaQuery = defaultView.matchMedia('(prefers-color-scheme: dark)');
			this._systemTheme.set(mediaQuery.matches ? 'dark' : 'light');
		}
	}
	
	private setupSystemThemeListener(): void {
		const defaultView = this.document.defaultView;
		if (defaultView && defaultView.matchMedia) {
			const mediaQuery = defaultView.matchMedia('(prefers-color-scheme: dark)');
			
			const listener = (e: MediaQueryListEvent) => {
				this._systemTheme.set(e.matches ? 'dark' : 'light');
			};
			
			mediaQuery.addEventListener('change', listener);
		}
	}
	
	private loadSavedTheme(): void {
		if (this.localStorage) {
			const savedTheme = this.localStorage.getItem(this.storageKey) as Theme;
			if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
				this._theme.set(savedTheme);
			}
		}
	}
	
	private saveTheme(theme: Theme): void {
		if (this.localStorage) {
			this.localStorage.setItem(this.storageKey, theme);
		}
	}
	
	private applyTheme(resolvedTheme: 'light' | 'dark'): void {
		const htmlElement = this.document.documentElement;
		
		if (resolvedTheme === 'dark') {
			htmlElement.classList.add('dark');
			htmlElement.classList.remove('light');
		} else {
			htmlElement.classList.add('light');
			htmlElement.classList.remove('dark');
		}
	}
}
