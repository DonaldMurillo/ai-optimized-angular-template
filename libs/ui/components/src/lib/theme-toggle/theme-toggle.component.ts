import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ThemeService } from '@ai-optimized-angular-template/services';

@Component({
	selector: 'ui-theme-toggle',
	template: `
		<div class="relative">
			<button
				(click)="toggleTheme()"
				class="relative p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 ease-in-out group"
				[attr.aria-label]="buttonLabel()"
				type="button">
				
				<!-- Sun Icon (Light Mode) -->
				<svg 
					class="w-5 h-5 transition-all duration-300 ease-in-out transform"
					[class]="'opacity-' + (themeService.resolvedTheme() === 'light' ? '100' : '0') + ' ' + 
							 'rotate-' + (themeService.resolvedTheme() === 'light' ? '0' : '90')"
					fill="currentColor" 
					viewBox="0 0 20 20">
					<path 
						fill-rule="evenodd" 
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
						clip-rule="evenodd" />
				</svg>
				
				<!-- Moon Icon (Dark Mode) -->
				<svg 
					class="absolute top-2 left-2 w-5 h-5 transition-all duration-300 ease-in-out transform"
					[class]="'opacity-' + (themeService.resolvedTheme() === 'dark' ? '100' : '0') + ' ' +
							 (themeService.resolvedTheme() === 'light' ? '-rotate-90' : 'rotate-0')"
					fill="currentColor" 
					viewBox="0 0 20 20">
					<path 
						d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			</button>
			
			<!-- Tooltip -->
			<div class="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
				{{ tooltipText() }}
				<div class="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"></div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
	protected readonly themeService = inject(ThemeService);
	
	protected readonly buttonLabel = computed(() => {
		const current = this.themeService.resolvedTheme();
		return current === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
	});
	
	protected readonly tooltipText = computed(() => {
		const current = this.themeService.resolvedTheme();
		return current === 'light' ? 'Dark mode' : 'Light mode';
	});
	
	protected toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
