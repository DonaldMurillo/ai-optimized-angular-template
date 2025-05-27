import { Component, ChangeDetectionStrategy, input, computed, output, signal } from '@angular/core';

export interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
	group?: string;
}

export interface SelectConfig {
	classNames?: {
		host?: string;
		container?: string;
		label?: string;
		select?: string;
		option?: string;
		helperText?: string;
		icon?: string;
	};
	size?: 'sm' | 'md' | 'lg';
	state?: 'default' | 'success' | 'warning' | 'error';
	disabled?: boolean;
	required?: boolean;
	multiple?: boolean;
	searchable?: boolean;
}

export interface SelectData {
	options: SelectOption[];
	value?: string | number | (string | number)[];
	placeholder?: string;
	label?: string;
	helperText?: string;
	id?: string;
}

@Component({
	selector: 'ui-select',
	standalone: true,
	host: {
		class: 'block w-full'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label) {
				<label 
					[for]="selectId()"
					[class]="labelClasses()">
					{{ data().label }}
					@if (config().required) {
						<span class="text-red-500 ml-1">*</span>
					}
				</label>
			}
			
			<div class="relative">
				@if (config().searchable) {
					<!-- Searchable Select (Custom Implementation) -->
					<button
						[id]="selectId()"
						type="button"
						[class]="selectClasses()"
						[disabled]="config().disabled || false"
						(click)="toggleDropdown()"
						(blur)="onBlur.emit()">
						<span class="block truncate text-left">
							{{ selectedLabel() || data().placeholder || 'Select option...' }}
						</span>
						<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<svg [class]="iconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</span>
					</button>
					
					@if (isOpen()) {
						<div class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md border border-gray-300 dark:border-gray-600 overflow-auto">
							@if (config().searchable) {
								<div class="p-2 border-b border-gray-200 dark:border-gray-700">
									<input
										type="text"
										class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Search options..."
										[value]="searchTerm()"
										(input)="handleSearchInput($event)"
									/>
								</div>
							}
							<div class="py-1">
								@for (option of filteredOptions(); track option.value) {
									<button
										type="button"
										[class]="getOptionClasses(option)"
										[disabled]="option.disabled"
										(click)="selectOption(option)">
										{{ option.label }}
									</button>
								}
								@if (filteredOptions().length === 0) {
									<div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
										No options found
									</div>
								}
							</div>
						</div>
					}
				} @else {
					<!-- Native Select -->
					<select
						[id]="selectId()"
						[class]="selectClasses()"
						[disabled]="config().disabled || false"
						[required]="config().required || false"
						[multiple]="config().multiple || false"
						[value]="data().value || ''"
						(change)="onNativeChange($event)"
						(focus)="onFocus.emit()"
						(blur)="onBlur.emit()">
						@if (data().placeholder && !config().multiple) {
							<option value="" disabled>{{ data().placeholder }}</option>
						}
						@for (option of data().options; track option.value) {
							<option 
								[value]="option.value" 
								[disabled]="option.disabled"
								[class]="config().classNames?.option || ''">
								{{ option.label }}
							</option>
						}
					</select>
					
					@if (!config().multiple) {
						<div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<svg [class]="iconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					}
				}
			</div>
			
			@if (data().helperText) {
				<p [class]="helperTextClasses()">{{ data().helperText }}</p>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
	data = input.required<SelectData>();
	config = input<SelectConfig>({});
	
	onChange = output<string | number | (string | number)[]>();
	onFocus = output<void>();
	onBlur = output<void>();

	// Internal state for searchable select
	protected isOpen = signal(false);
	protected searchTerm = signal('');

	protected selectId = computed(() => {
		return this.data().id || `select-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected selectedLabel = computed(() => {
		const value = this.data().value;
		if (!value) return '';
		
		if (Array.isArray(value)) {
			if (value.length === 0) return '';
			if (value.length === 1) {
				const option = this.data().options.find(opt => opt.value === value[0]);
				return option?.label || '';
			}
			return `${value.length} selected`;
		}
		
		const option = this.data().options.find(opt => opt.value === value);
		return option?.label || '';
	});

	protected filteredOptions = computed(() => {
		const term = this.searchTerm().toLowerCase();
		if (!term) return this.data().options;
		
		return this.data().options.filter(option => 
			option.label.toLowerCase().includes(term)
		);
	});

	protected containerClasses = computed(() => {
		const baseClasses = 'space-y-2';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected labelClasses = computed(() => {
		const baseClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
		
		return [
			baseClasses,
			this.config().classNames?.label || ''
		].filter(Boolean).join(' ');
	});

	protected selectClasses = computed(() => {
		const baseClasses = 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
		
		const sizeClasses = {
			sm: 'px-3 py-2 text-sm',
			md: 'px-4 py-3 text-base',
			lg: 'px-5 py-4 text-lg'
		};

		const stateClasses = {
			default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500',
			success: 'border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-green-500',
			warning: 'border-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-yellow-500',
			error: 'border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500'
		};

		const disabledClasses = this.config().disabled 
			? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700' 
			: 'cursor-pointer';

		const paddingClasses = !this.config().multiple && !this.config().searchable ? 'pr-10' : '';

		const size = this.config().size || 'md';
		const state = this.config().state || 'default';

		return [
			baseClasses,
			sizeClasses[size],
			stateClasses[state],
			disabledClasses,
			paddingClasses,
			this.config().classNames?.select || ''
		].filter(Boolean).join(' ');
	});

	protected optionClasses = computed(() => {
		return (option: SelectOption) => {
			const baseClasses = 'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700';
			const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
			
			return [
				baseClasses,
				disabledClasses,
				this.config().classNames?.option || ''
			].filter(Boolean).join(' ');
		};
	});

	protected getOptionClasses(option: SelectOption): string {
		return this.optionClasses()(option);
	}

	protected iconClasses = computed(() => {
		const baseClasses = 'h-5 w-5 text-gray-400 dark:text-gray-500';
		
		return [
			baseClasses,
			this.config().classNames?.icon || ''
		].filter(Boolean).join(' ');
	});

	protected helperTextClasses = computed(() => {
		const baseClasses = 'text-sm';
		
		const stateClasses = {
			default: 'text-gray-600 dark:text-gray-400',
			success: 'text-green-600 dark:text-green-400',
			warning: 'text-yellow-600 dark:text-yellow-400',
			error: 'text-red-600 dark:text-red-400'
		};

		const state = this.config().state || 'default';

		return [
			baseClasses,
			stateClasses[state],
			this.config().classNames?.helperText || ''
		].filter(Boolean).join(' ');
	});

	protected toggleDropdown(): void {
		if (!this.config().disabled) {
			this.isOpen.set(!this.isOpen());
		}
	}

	protected selectOption(option: SelectOption): void {
		if (option.disabled) return;
		
		this.onChange.emit(option.value);
		this.isOpen.set(false);
		this.searchTerm.set('');
	}

	protected handleSearchInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.searchTerm.set(target.value);
	}

	protected onNativeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		
		if (this.config().multiple) {
			const selectedValues = Array.from(target.selectedOptions).map(option => option.value);
			this.onChange.emit(selectedValues);
		} else {
			this.onChange.emit(target.value);
		}
	}
}
