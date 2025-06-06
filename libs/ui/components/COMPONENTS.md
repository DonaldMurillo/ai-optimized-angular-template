# UI Components Library

This library contains reusable Angular components extracted from the main pages component, designed with modern Angular patterns and AI-first development principles.

## Components

### 🔘 Button Component (`ui-button`)

A flexible button component with multiple variants and states.

**Usage:**
```typescript
<ui-button 
  [data]="{ text: 'Click me', icon: '🚀' }"
  [config]="{ variant: 'primary', size: 'lg', loading: false }"
  (onClick)="handleClick()">
</ui-button>
```

**Props:**
- `data`: `{ text: string, icon?: string }`
- `config`: `{ variant?: 'primary' | 'secondary' | 'ghost', size?: 'sm' | 'md' | 'lg', disabled?: boolean, loading?: boolean }`

### 🏷️ Badge Component (`ui-badge`)

Status indicators and tech stack tags with various styles.

**Usage:**
```typescript
<ui-badge 
  [data]="{ text: 'Status', icon?: '🟢' }"
  [config]="{ variant: 'status', color: 'green', showDot: true, animate: true }">
</ui-badge>
```

**Props:**
- `data`: `{ text: string, icon?: string }`
- `config`: `{ variant?: 'status' | 'tech' | 'feature', color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'gray', showDot?: boolean, animate?: boolean }`

### 🃏 Card Component (`ui-card`)

Flexible card component for features, content, and information display.

**Usage:**
```typescript
<ui-card 
  [data]="{ 
    icon: '⚡', 
    title: 'Feature Title', 
    description: 'Feature description',
    gradient: 'from-blue-500 to-purple-600'
  }"
  [config]="{ variant: 'feature', hoverable: true }">
</ui-card>
```

**Props:**
- `data`: `{ icon?: string, title: string, description: string, gradient?: string }`
- `config`: `{ variant?: 'default' | 'feature' | 'tech-stack', hoverable?: boolean }`

### 💻 Code Window Component (`ui-code-window`)

Terminal and code display with syntax highlighting and window controls.

**Usage:**
```typescript
<ui-code-window 
  [data]="{
    title: 'Terminal',
    lines: [
      { type: 'comment', content: '# Install dependencies' },
      { type: 'normal', content: 'npm install' }
    ]
  }"
  [config]="{ variant: 'terminal' }">
</ui-code-window>
```

**Props:**
- `data`: `{ title?: string, lines: Array<{ type?: 'comment' | 'keyword' | 'string' | 'variable' | 'normal', content: string, indent?: number }> }`
- `config`: `{ variant?: 'terminal' | 'code', showControls?: boolean }`

### 🔧 Tech Stack Item Component (`ui-tech-stack-item`)

Specialized component for displaying technology stack items with icons and descriptions.

**Usage:**
```typescript
<ui-tech-stack-item 
  [data]="{
    name: 'Angular 18+',
    description: 'Modern framework with signals',
    icon: 'A',
    gradient: 'from-red-500 to-red-600'
  }">
</ui-tech-stack-item>
```

**Props:**
- `data`: `{ name: string, description: string, icon: string, gradient: string }`

### 🔤 Input Component (`ui-input`)

Versatile input component supporting multiple types and validation states.

**Usage:**
```typescript
<ui-input 
  [data]="{ 
    label: 'Email', 
    placeholder: 'Enter email', 
    icon: '📧',
    helperText: 'We will never share your email'
  }"
  [config]="{ 
    type: 'email', 
    size: 'md', 
    state: 'default',
    iconPosition: 'prefix'
  }"
  (onInput)="handleInput($event)">
</ui-input>
```

**Props:**
- `data`: `{ value?: string | number, placeholder?: string, label?: string, helperText?: string, icon?: string, id?: string }`
- `config`: `{ type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url', size?: 'sm' | 'md' | 'lg', state?: 'default' | 'success' | 'warning' | 'error', disabled?: boolean, readonly?: boolean, required?: boolean, iconPosition?: 'prefix' | 'suffix' }`

### 📝 Textarea Component (`ui-textarea`)

Multi-line text input with auto-resize and character counting.

**Usage:**
```typescript
<ui-textarea 
  [data]="{ 
    label: 'Description', 
    placeholder: 'Enter description...', 
    maxLength: 500 
  }"
  [config]="{ 
    rows: 4, 
    autoResize: true, 
    state: 'default' 
  }"
  (onInput)="handleInput($event)">
</ui-textarea>
```

**Props:**
- `data`: `{ value?: string, placeholder?: string, label?: string, helperText?: string, id?: string, maxLength?: number }`
- `config`: `{ rows?: number, maxRows?: number, autoResize?: boolean, resize?: 'none' | 'vertical' | 'horizontal' | 'both', state?: 'default' | 'success' | 'warning' | 'error', disabled?: boolean, readonly?: boolean, required?: boolean }`

### ☑️ Checkbox Component (`ui-checkbox`)

Flexible checkbox component with labels and descriptions.

**Usage:**
```typescript
<ui-checkbox 
  [data]="{ 
    label: 'Accept Terms', 
    description: 'I agree to the terms and conditions',
    checked: false 
  }"
  [config]="{ 
    size: 'md', 
    labelPosition: 'right' 
  }"
  (onChange)="handleChange($event)">
</ui-checkbox>
```

**Props:**
- `data`: `{ checked?: boolean, value?: string | number, label?: string, description?: string, id?: string }`
- `config`: `{ size?: 'sm' | 'md' | 'lg', disabled?: boolean, indeterminate?: boolean, labelPosition?: 'left' | 'right' }`

### 🔘 Radio Component (`ui-radio`)

Radio button groups with horizontal and vertical layouts.

**Usage:**
```typescript
<ui-radio 
  [data]="{
    label: 'Plan Selection',
    options: [
      { value: 'basic', label: 'Basic', description: 'Perfect for individuals' },
      { value: 'pro', label: 'Pro', description: 'Great for teams' }
    ],
    value: 'basic'
  }"
  [config]="{ orientation: 'vertical', size: 'md' }"
  (onChange)="handleChange($event)">
</ui-radio>
```

**Props:**
- `data`: `{ options: RadioOption[], value?: string | number, label?: string }`
- `config`: `{ orientation?: 'horizontal' | 'vertical', size?: 'sm' | 'md' | 'lg', disabled?: boolean, name?: string }`

### 🔄 Toggle Component (`ui-toggle`)

Switch/toggle button with customizable colors and positions.

**Usage:**
```typescript
<ui-toggle 
  [data]="{ 
    label: 'Dark Mode', 
    description: 'Switch between themes',
    checked: false 
  }"
  [config]="{ 
    size: 'md', 
    color: 'blue', 
    labelPosition: 'right' 
  }"
  (onChange)="handleToggle($event)">
</ui-toggle>
```

**Props:**
- `data`: `{ checked?: boolean, label?: string, description?: string, id?: string }`
- `config`: `{ size?: 'sm' | 'md' | 'lg', disabled?: boolean, labelPosition?: 'left' | 'right', color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' }`

### 📍 Select Component (`ui-select`)

Dropdown select with search functionality and multiple selection support.

**Usage:**
```typescript
<ui-select 
  [data]="{
    label: 'Country',
    placeholder: 'Select country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' }
    ]
  }"
  [config]="{ 
    searchable: true, 
    multiple: false, 
    size: 'md' 
  }"
  (onChange)="handleChange($event)">
</ui-select>
```

**Props:**
- `data`: `{ options: SelectOption[], value?: string | number | (string | number)[], placeholder?: string, label?: string, helperText?: string, id?: string }`
- `config`: `{ size?: 'sm' | 'md' | 'lg', state?: 'default' | 'success' | 'warning' | 'error', disabled?: boolean, required?: boolean, multiple?: boolean, searchable?: boolean }`

## Design Principles

### 🎯 Modern Angular Patterns
- **Signals**: All components use signals for reactive state management
- **Computed Properties**: Derived state with computed signals
- **Standalone Components**: No module dependencies
- **OnPush Change Detection**: Optimized performance
- **New Control Flow**: Using `@if`, `@for` syntax

### 🎨 Styling
- **Tailwind CSS**: Utility-first approach with dark mode support
- **Consistent Design System**: Unified spacing, colors, and typography
- **Responsive**: Mobile-first design patterns
- **Accessible**: ARIA compliant and keyboard navigation

### 🏗️ Architecture
- **Component Data Pattern**: Each component accepts `data` and `config` inputs
- **Class Name Customization**: Components support custom CSS classes via `config.classNames`
- **Type Safety**: Full TypeScript interfaces with strict typing
- **AI-Optimized**: Clear patterns that AI tools can understand and replicate

## Usage in Other Components

Import the components you need:

```typescript
import { 
  ButtonComponent,
  CardComponent,
  BadgeComponent,
  CodeWindowComponent,
  TechStackItemComponent,
  InputComponent,
  TextareaComponent,
  CheckboxComponent,
  RadioComponent,
  ToggleComponent,
  SelectComponent
} from '@ai-optimized-angular-template/components';

@Component({
  imports: [ButtonComponent, CardComponent, BadgeComponent, InputComponent],
  // ...
})
```

## Component Showcase

Use the `ComponentShowcaseComponent` to see all components in action:

```typescript
import { ComponentShowcaseComponent } from '@ai-optimized-angular-template/components';

@Component({
  template: '<ui-component-showcase></ui-component-showcase>',
  imports: [ComponentShowcaseComponent]
})
```

This component demonstrates all variants, states, and configuration options available.
