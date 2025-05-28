---
applyTo: '**/*.component.ts'
---

## Always
- Use tailwindcss classes
- use tailwindcss animations
- Do class binding with tailwind utility classes like `[class.bg-red-500]="true"` w/o a slash ("/") in the class name.

## Never

- Do class binding with tailwind utility classes like `[class.bg-red-500/80]="true"` where there is a slash ("/"). it breaks angular compilation.
