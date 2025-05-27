---
applyTo: '**/*.ts'
---

## Always

- Put files in the correct library (if applicable) based on the project folder structure use a tool if necessary.
- API App is set up as a lego set, libs represent some functionality and are not bound to module so I add them to the app as needed
- check for typescript errors

## Never

- Use the document or window object directly in angular. use the `DOCUMENT` injection token instead.
- LEave files with errors in the codebase. If you see an error, fix it.

## Components:

- use 2 inputs for components: `data` and `config`. `data` is the data to be displayed, `config` is the configuration for the component. Config can have a property `classNames` which is a object with node names with class names to be applied to the node. use `config.classNames.host` for base component
- use the `host` property in the component decorator instead of hostbinding decorator
- do not worry about unit tests for components, we will add them later
- don't try to build the app. first check if the server is running and then check the console to make sure there are not errors
-