import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { 
	InputComponent, 
	TextareaComponent, 
	CheckboxComponent, 
	RadioComponent, 
	ToggleComponent, 
	SelectComponent 
} from '@ui/components';

@Component({
	selector: 'ui-forms-showcase-widget',
	standalone: true,
	imports: [
		InputComponent,
		TextareaComponent,
		CheckboxComponent,
		RadioComponent,
		ToggleComponent,
		SelectComponent
	],
	host: {
		class: 'block'
	},
	template: `
		<section class="scroll-mt-24">
			<div class="text-center mb-12">
				<div class="inline-flex items-center gap-3 mb-4">
					<span class="text-2xl">📝</span>
					<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Form Components
					</h2>
				</div>
				<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Comprehensive form inputs with validation states and modern styling
				</p>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Input Components -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-blue-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Text Inputs</h3>
					</div>
					<div class="space-y-6">
						<ui-input 
							[data]="{ label: 'Name', placeholder: 'Enter your name', value: inputValue() }"
							[config]="{ type: 'text', size: 'md', state: 'default' }"
							(onInput)="onInputChange($event)">
						</ui-input>
						<ui-input 
							[data]="{ label: 'Email', placeholder: 'your@email.com', helperText: 'We will never share your email' }"
							[config]="{ type: 'email', size: 'md', state: 'default' }">
						</ui-input>
						<ui-input 
							[data]="{ label: 'Password', placeholder: 'Enter password' }"
							[config]="{ type: 'password', size: 'md', state: 'default' }">
						</ui-input>
						<ui-input 
							[data]="{ label: 'Success State', value: 'Valid input', helperText: 'This looks good!' }"
							[config]="{ state: 'success', readonly: true }">
						</ui-input>
						<ui-input 
							[data]="{ label: 'Error State', value: 'Invalid input', helperText: 'Please fix this error' }"
							[config]="{ state: 'error' }">
						</ui-input>
					</div>
				</div>

				<!-- Textarea and Selection -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Textarea & Select</h3>
					</div>
					<div class="space-y-6">
						<ui-textarea 
							[data]="{ label: 'Description', placeholder: 'Tell us about yourself...', value: textareaValue() }"
							[config]="{ rows: 4, resize: 'vertical' }"
							(onInput)="onTextareaChange($event)">
						</ui-textarea>
						<ui-select 
							[data]="{
								label: 'Country',
								placeholder: 'Select your country',
								value: selectValue(),
								options: [
									{ value: 'us', label: 'United States' },
									{ value: 'ca', label: 'Canada' },
									{ value: 'uk', label: 'United Kingdom' },
									{ value: 'de', label: 'Germany' }
								]
							}"
							[config]="{ searchable: true }"
							(onChange)="onSelectChange($event)">
						</ui-select>
					</div>
				</div>

				<!-- Checkboxes and Radio -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-purple-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Choices</h3>
					</div>
					<div class="space-y-6">
						<div class="space-y-3">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Checkboxes</h4>
							<ui-checkbox 
								[data]="{ label: 'Newsletter subscription', description: 'Get updates about new features', checked: checkboxValue() }"
								[config]="{ size: 'md' }"
								(onChange)="onCheckboxChange($event)">
							</ui-checkbox>
							<ui-checkbox 
								[data]="{ label: 'Terms and conditions', checked: true }"
								[config]="{ size: 'md' }">
							</ui-checkbox>
						</div>
						<div class="space-y-3">
							<ui-radio 
								[data]="{
									label: 'Plan Selection',
									options: [
										{ value: 'basic', label: 'Basic', description: 'Perfect for individuals' },
										{ value: 'pro', label: 'Pro', description: 'Great for teams' },
										{ value: 'enterprise', label: 'Enterprise', description: 'For large organizations' }
									],
									value: radioValue() || 'pro'
								}"
								[config]="{ orientation: 'vertical' }"
								(onChange)="onRadioChange($event)">
							</ui-radio>
						</div>
					</div>
				</div>

				<!-- Toggles and Controls -->
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-orange-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Toggle Controls</h3>
					</div>
					<div class="space-y-6">
						<ui-toggle 
							[data]="{ label: 'Dark Mode', checked: toggleStates().darkMode }"
							[config]="{ size: 'md', color: 'blue' }"
							(onChange)="onToggleChange('darkMode', $event)">
						</ui-toggle>
						<ui-toggle 
							[data]="{ label: 'Email Notifications', checked: toggleStates().emailNotifications }"
							[config]="{ size: 'md', color: 'green' }"
							(onChange)="onToggleChange('emailNotifications', $event)">
						</ui-toggle>
						<ui-toggle 
							[data]="{ label: 'Auto-save', description: 'Automatically save your work', checked: toggleStates().autoSave }"
							[config]="{ size: 'lg', color: 'purple', labelPosition: 'left' }"
							(onChange)="onToggleChange('autoSave', $event)">
						</ui-toggle>
					</div>
				</div>
			</div>

			<!-- Form Validation Examples -->
			<div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-red-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Validation States</h3>
					</div>
					<div class="space-y-6">
						<ui-input 
							[data]="{ label: 'Warning State', value: 'Check this input', helperText: 'This might need attention' }"
							[config]="{ state: 'warning' }">
						</ui-input>
						<ui-input 
							[data]="{ label: 'Disabled Input', value: 'Cannot edit this', helperText: 'This field is disabled' }"
							[config]="{ disabled: true }">
						</ui-input>
						<ui-textarea 
							[data]="{ label: 'Error Textarea', value: 'Invalid content here', helperText: 'Please provide valid content' }"
							[config]="{ state: 'error', rows: 3 }">
						</ui-textarea>
					</div>
				</div>

				<div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
						<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Advanced Controls</h3>
					</div>
					<div class="space-y-6">
						<ui-select 
							[data]="{
								label: 'Multi-select Example',
								placeholder: 'Choose multiple options',
								value: '',
								options: [
									{ value: 'angular', label: 'Angular' },
									{ value: 'react', label: 'React' },
									{ value: 'vue', label: 'Vue.js' },
									{ value: 'svelte', label: 'Svelte' }
								]
							}"
							[config]="{ multiple: true, searchable: true }">
						</ui-select>
						<ui-checkbox 
							[data]="{ label: 'Indeterminate state', checked: false }"
							[config]="{ indeterminate: true, size: 'lg' }">
						</ui-checkbox>
					</div>
				</div>
			</div>

			<!-- Form Interaction Demo -->
			<div class="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8">
				<h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
					Interactive Form Demo
				</h3>
				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Input Value:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">"{{ inputValue() || 'Empty' }}"</span>
						</div>
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Checkbox:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">{{ checkboxValue() ? 'Checked' : 'Unchecked' }}</span>
						</div>
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Selected Country:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">"{{ selectValue() || 'None' }}"</span>
						</div>
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Selected Plan:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">"{{ radioValue() || 'pro' }}"</span>
						</div>
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Textarea Length:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">{{ textareaValue().length }} characters</span>
						</div>
						<div>
							<span class="font-medium text-gray-700 dark:text-gray-300">Active Toggles:</span>
							<span class="ml-2 text-gray-600 dark:text-gray-400">{{ getActiveToggles() }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsShowcaseWidget {
	// Internal state for form demonstrations
	inputValue = signal('John Doe');
	textareaValue = signal('This is a sample description that shows how the textarea component works with longer content.');
	selectValue = signal('us');
	checkboxValue = signal(true);
	radioValue = signal('pro');
	toggleStates = signal({
		darkMode: false,
		emailNotifications: true,
		autoSave: true
	});

	onInputChange(value: string): void {
		this.inputValue.set(value);
	}

	onTextareaChange(value: string): void {
		this.textareaValue.set(value);
	}

	onSelectChange(value: string | number | (string | number)[]): void {
		this.selectValue.set(String(value));
	}

	onCheckboxChange(checked: boolean): void {
		this.checkboxValue.set(checked);
	}

	onRadioChange(value: string | number): void {
		this.radioValue.set(String(value));
	}

	onToggleChange(key: string, value: boolean): void {
		this.toggleStates.update(current => ({
			...current,
			[key]: value
		}));
	}

	getActiveToggles(): string {
		const states = this.toggleStates();
		const active = Object.entries(states)
			.filter(([, value]) => value)
			.map(([key]) => key);
		return active.length > 0 ? active.join(', ') : 'None';
	}
}
