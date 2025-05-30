import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent, FileManagerComponent } from '@ui/components';
import { FileResponse } from '@ai-optimized-angular-template/services';

@Component({
	selector: 'lib-file-management-page',
	standalone: true,
	imports: [CommonModule, FileUploadComponent, FileManagerComponent],
	template: `
		<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
			<div class="container mx-auto px-6 py-8">
				<!-- Header -->
				<div class="text-center mb-8">
					<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
						File Management
					</h1>
					<p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
						Upload, manage, and organize your files with our powerful file management system. 
						Supports images, documents, and various file types with preview capabilities.
					</p>
				</div>

				<!-- File Upload Section -->
				<div class="mb-12">
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
						<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Upload Files
						</h2>
						<ui-file-upload
							[config]="uploadConfig()"
							(fileUploaded)="onFileUploaded($event)"
							(fileDeleted)="onFileDeleted($event)"
							(uploadError)="onUploadError($event)">
						</ui-file-upload>
					</div>
				</div>

				<!-- File Manager Section -->
				<div>
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
						<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
							Manage Files
						</h2>
						<ui-file-manager [userId]="undefined"></ui-file-manager>
					</div>
				</div>

				<!-- Stats Section -->
				@if (uploadStats(); as stats) {
					<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
									</svg>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
											Files Uploaded
										</dt>
										<dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
											{{ stats.filesUploaded }}
										</dd>
									</dl>
								</div>
							</div>
						</div>

						<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
											Total Size
										</dt>
										<dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
											{{ formatBytes(stats.totalSize) }}
										</dd>
									</dl>
								</div>
							</div>
						</div>

						<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
											Images
										</dt>
										<dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
											{{ stats.imagesCount }}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagementPageComponent {
	readonly uploadConfig = signal({
		acceptedTypes: ['image/*', '.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx'],
		maxFileSize: 10 * 1024 * 1024, // 10MB
		multiple: true,
	});

	readonly uploadStats = signal<{
		filesUploaded: number;
		totalSize: number;
		imagesCount: number;
	} | null>(null);

	onFileUploaded(file: FileResponse): void {
		console.log('File uploaded:', file);
		this.updateStats();
	}

	onFileDeleted(fileId: string): void {
		console.log('File deleted:', fileId);
		this.updateStats();
	}

	onUploadError(error: string): void {
		console.error('Upload error:', error);
	}

	private updateStats(): void {
		// In a real application, you might fetch these stats from the file service
		// For now, we'll just update some dummy stats
		const current = this.uploadStats();
		this.uploadStats.set({
			filesUploaded: (current?.filesUploaded ?? 0) + 1,
			totalSize: (current?.totalSize ?? 0) + Math.random() * 1000000,
			imagesCount: (current?.imagesCount ?? 0) + (Math.random() > 0.5 ? 1 : 0),
		});
	}

	formatBytes(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
}
