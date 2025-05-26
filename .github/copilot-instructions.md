# Angular Modern Development Guidelines & Single File Component Example

This document outlines best practices for building modern Angular applications using:
- **Signals & Computed Properties** for reactive state
- New **output** instead of @Output
- The **`inject()` function** for dependency injection
- **Signal queries** (as available even if not stable) instead of decorators like `@ViewChild`
- Angular's **new control flow syntax**
- **OnPush change detection** for performance
- **Strict TypeScript** (with no non-null assertions)
- **Single File Components** (all template, style, and logic in one file)
- **Tailwind CSS** for styling
- **Tailwind Animations** when necessary
- **Light and Darkmode** Always make colors compatible with light and dark mode

> **Note:** Adjust any experimental API (e.g., signal queries) as the Angular framework evolves.

## 1. Prerequisites

- **Angular Version:** 18+ (supporting signals, computed properties, and the new APIs)
- **Project Structure:** Using an Nx monorepo (if applicable)
- **TypeScript:** Strict mode enabled (avoid using `!` for possible null values)
- **Tailwind CSS:** Properly integrated in your project build
- **Animations:** Use tailwind animations module if animations are used

## 2. Comprehensive Single File Component Example

Below is an example of a single file component that demonstrates modern Angular features:

```typescript
import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
	host: {
		class: 'w-full h-full'
	},
  selector: 'app-modern-example',
  standalone: true,
  template: `
    <div class="p-4 bg-gray-100 rounded shadow-md transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
      <h1 class="text-xl font-bold animate-fade-in">{{ title() }}</h1>
      <button 
        (click)="increment()" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded transition-colors duration-200 ease-in-out hover:bg-blue-600 active:bg-blue-700">
        Increment
      </button>
      <p class="mt-2">Count: {{ count() }}</p>

      @if (data(); as result) {
        <div class="mt-4 p-2 bg-green-100 rounded animate-fade-in">
          <p>Data: {{ result }}</p>
        </div>
      } @else {
        <div class="mt-4 p-2 bg-yellow-100 rounded animate-pulse">
          <p>Loading...</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModernExampleComponent {
  count = signal(0);
  title = computed(() => `Current count is ${this.count()}`);
  data = signal<string | null>('Hello, Angular with signals!');
  private document = inject(DOCUMENT);

  increment(): void {
    this.count.update(current => current + 1);
  }
}
```

## 3. Additional Guidelines

- **Single File Components:** Encapsulate component's template, styles, and logic within one file
- **OnPush Change Detection:** Use for performance and future-proofing
- **Strict TypeScript:** Avoid non-null assertions and leverage strict mode
- **Tailwind CSS:** Use utility classes directly in templates
- **Animations:** Use Tailwind. Keep subtle and performant
- **New Control Flow Syntax:** Use Angular's improved flow control instead of structural directives
- **Dependency Injection:** Prefer the `inject()` function in standalone components
- **Indentation** Use tabs and set them as 3 spaces