---
applyTo: 'package.json'
---
## Never

- Do not add any dependencies to this file manually.

## Always

- Add dependencies to this file using the `npm i` command.
- Unless otherwise specified, add random scripts here instead of adding them to nx projects.
- install one package at a time, e.g. `npm i @nx/angular@latest` instead of `npm i @nx/angular@latest @nx/js@latest`.