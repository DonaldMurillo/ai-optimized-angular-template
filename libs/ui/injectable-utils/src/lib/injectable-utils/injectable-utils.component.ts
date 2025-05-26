import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-injectable-utils',
  imports: [CommonModule],
  template: `<p>InjectableUtils works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InjectableUtilsComponent {}
