import { Route } from '@angular/router';

export const appRoutes: Route[] = [
	{ path: '', loadComponent: () => import('@ai-optimized-angular-template/pages').then(m => m.PagesComponent) },
	{ path: 'showcase', loadComponent: () => import('@ai-optimized-angular-template/pages').then(m => m.ShowcasePageComponent) },
	{ path: 'files', loadComponent: () => import('@ai-optimized-angular-template/pages').then(m => m.FileManagementPageComponent) },
];
