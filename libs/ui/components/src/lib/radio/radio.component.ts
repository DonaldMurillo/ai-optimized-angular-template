import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';

export interface RadioOption {
	value: string | number;
	label: string;
	description?: string;
	disabled?: boolean;
}

export interface RadioConfig {
	classNames?: {
		host?: string;
		container?: string;
		group?: string;
		option?: string;
		radio?: string;
		label?: string;
		description?: string;
	};
	orientation?: 'horizontal' | 'vertical';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	name?: string;
}

export interface RadioData {
	options: RadioOption[];
	value?: string | number;
	label?: string;
}

@Component({
	selector: 'ui-radio',
	standalone: true,
	host: {
		class: 'block'
	},
	template: `
		<div [class]="containerClasses()">
			@if (data().label) {
				<legend class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
					{{ data().label }}
				</legend>
			}
			
			<div [class]="groupClasses()">
				@for (option of data().options; track option.value) {
					<div [class]="optionClasses()">
						<div class="flex items-start">
							<input
								[id]="getOptionId(option.value)"
								type="radio"
								[name]="radioName()"
								[value]="option.value"
								[class]="radioClasses()"
								[checked]="isSelected(option.value)"
								[disabled]="isOptionDisabled(option)"
								(change)="handleChange(option.value)"
							/>
							<div class="ml-3">
								<label 
									[for]="getOptionId(option.value)" 
									[class]="getLabelClasses(option)">
									{{ option.label }}
								</label>
								@if (option.description) {
									<p [class]="descriptionClasses()">{{ option.description }}</p>
								}
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
	data = input.required<RadioData>();
	config = input<RadioConfig>({});
	
	onChange = output<string | number>();

	protected radioName = computed(() => {
		return this.config().name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
	});

	protected containerClasses = computed(() => {
		const baseClasses = 'space-y-3';
		
		return [
			baseClasses,
			this.config().classNames?.container || ''
		].filter(Boolean).join(' ');
	});

	protected groupClasses = computed(() => {
		const orientationClasses = {
			horizontal: 'flex flex-wrap gap-6',
			vertical: 'space-y-3'
		};

		const orientation = this.config().orientation || 'vertical';

		return [
			orientationClasses[orientation],
			this.config().classNames?.group || ''
		].filter(Boolean).join(' ');
	});

	protected optionClasses = computed(() => {
		const baseClasses = '';
		
		return [
			baseClasses,
			this.config().classNames?.option || ''
		].filter(Boolean).join(' ');
	});

	protected radioClasses = computed(() => {
		const baseClasses = 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200';
		
		const sizeClasses = {
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-6 w-6'
		};

		const size = this.config().size || 'md';

		return [
			baseClasses,
			sizeClasses[size],
			this.config().classNames?.radio || ''
		].filter(Boolean).join(' ');
	});

	protected labelClasses = computed(() => {
		return (option: RadioOption) => {
			const baseClasses = 'block text-sm font-medium text-gray-900 dark:text-gray-100';
			const disabledClasses = this.isOptionDisabled(option) 
				? 'opacity-50 cursor-not-allowed' 
				: 'cursor-pointer';
			
			return [
				baseClasses,
				disabledClasses,
				this.config().classNames?.label || ''
			].filter(Boolean).join(' ');
		};
	});

	protected getLabelClasses(option: RadioOption): string {
		return this.labelClasses()(option);
	}

	protected descriptionClasses = computed(() => {
		const baseClasses = 'text-sm text-gray-600 dark:text-gray-400 mt-1';
		
		return [
			baseClasses,
			this.config().classNames?.description || ''
		].filter(Boolean).join(' ');
	});

	protected isSelected(value: string | number): boolean {
		return this.data().value === value;
	}

	protected isOptionDisabled(option: RadioOption): boolean {
		return this.config().disabled === true || option.disabled === true;
	}

	protected getOptionId(value: string | number): string {
		return `${this.radioName()}-${value}`;
	}

	protected handleChange(value: string | number): void {
		this.onChange.emit(value);
	}
}
