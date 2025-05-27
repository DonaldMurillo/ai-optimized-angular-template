---
applyTo: '**/*.component.ts'
---

## Always
- Use tailwindcss classes
- use tailwindcss animations

## Never

- Do class binding with tailwind utility classes like `[class.bg-red-500/80]="true"` where there is a slash ("/"). it breaks angular compilation.
