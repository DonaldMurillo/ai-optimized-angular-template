import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentShowcaseComponent } from '@ai-optimized-angular-template/components';

@Component({
	selector: 'lib-showcase-page',
	standalone: true,
	imports: [ComponentShowcaseComponent],
	host: {
		class: 'block w-full min-h-screen'
	},
	template: `
		<ui-component-showcase></ui-component-showcase>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcasePageComponent {}
