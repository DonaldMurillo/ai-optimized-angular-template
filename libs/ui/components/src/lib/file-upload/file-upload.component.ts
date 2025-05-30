import { Component, ChangeDetectionStrategy, computed, signal, input, output, inject } from '@angular/core';
import { FileService, FileResponse } from '@ai-optimized-angular-template/services';
import { CommonModule } from '@angular/common';

export interface FileUploadConfig {
	acceptedTypes?: string[];
	maxFileSize?: number; // in bytes
	multiple?: boolean;
	uploadedById?: string;
}

@Component({
	selector: 'ui-file-upload',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="w-full">
			<!-- Drop Zone -->
			<div 
				class="border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-in-out
					{{ isDragOver() ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500' }}
					{{ isUploading() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' }}"
				(click)="triggerFileInput()"
				(dragover)="onDragOver($event)"
				(dragleave)="onDragLeave($event)"
				(drop)="onDrop($event)">
				
				<input 
					#fileInput 
					type="file" 
					class="hidden" 
					[accept]="acceptedTypesString()"
					[multiple]="config().multiple"
					(change)="onFileSelected($event)"
					[disabled]="isUploading()">
				
				@if (isUploading()) {
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p class="text-gray-600 dark:text-gray-300 mb-2">Uploading...</p>
					@if (uploadProgress(); as progress) {
						<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
							<div 
								class="bg-blue-500 h-2 rounded-full transition-all duration-300"
								[style.width.%]="progress.percentage">
							</div>
						</div>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ progress.percentage }}% - {{ formatFileSize(progress.loaded) }} of {{ formatFileSize(progress.total) }}
						</p>
					}
				} @else {
					<svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
						<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<p class="text-gray-600 dark:text-gray-300 mb-2">
						<span class="font-medium">Click to upload</span> or drag and drop
					</p>
					@if (config().acceptedTypes && config().acceptedTypes!.length > 0) {
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
							Accepted types: {{ config().acceptedTypes!.join(', ') }}
						</p>
					}
					@if (config().maxFileSize) {
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Max size: {{ formatFileSize(config().maxFileSize!) }}
						</p>
					}
				}
			</div>

			<!-- Error Message -->
			@if (errorMessage()) {
				<div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
					<p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
				</div>
			}

			<!-- Success Message -->
			@if (successMessage()) {
				<div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
					<p class="text-sm text-green-600 dark:text-green-400">{{ successMessage() }}</p>
				</div>
			}

			<!-- Uploaded Files -->
			@if (uploadedFiles().length > 0) {
				<div class="mt-6">
					<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Uploaded Files</h3>
					<div class="space-y-2">
						@for (file of uploadedFiles(); track file.id) {
							<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
								<div class="flex items-center space-x-3">
									@if (isImage(file.mimetype)) {
										<img 
											[src]="getPreviewUrl(file.id)" 
											[alt]="file.originalName"
											class="w-10 h-10 object-cover rounded">
									} @else {
										<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
											<svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
											</svg>
										</div>
									}
									<div>
										<p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ file.originalName }}</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(file.size) }}</p>
									</div>
								</div>
								<div class="flex items-center space-x-2">
									<button 
										(click)="downloadFile(file)"
										class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
										Download
									</button>
									<button 
										(click)="deleteFile(file.id)"
										class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200">
										Delete
									</button>
								</div>
							</div>
						}
					</div>
				</div>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
	private readonly fileService = inject(FileService);

	// Inputs
	readonly config = input<FileUploadConfig>({});

	// Outputs
	readonly fileUploaded = output<FileResponse>();
	readonly fileDeleted = output<string>();
	readonly uploadError = output<string>();

	// State
	readonly isDragOver = signal<boolean>(false);
	readonly errorMessage = signal<string>('');
	readonly successMessage = signal<string>('');
	readonly uploadedFiles = signal<FileResponse[]>([]);

	// Computed properties
	readonly isUploading = computed(() => this.fileService.isUploading());
	readonly uploadProgress = computed(() => this.fileService.uploadProgress());
	readonly acceptedTypesString = computed(() => {
		const types = this.config().acceptedTypes;
		return types ? types.join(',') : '';
	});

	triggerFileInput(): void {
		if (this.isUploading()) return;
		
		const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
		fileInput?.click();
	}

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		if (!this.isUploading()) {
			this.isDragOver.set(true);
		}
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		this.isDragOver.set(false);
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		this.isDragOver.set(false);
		
		if (this.isUploading()) return;

		const files = Array.from(event.dataTransfer?.files || []);
		this.handleFiles(files);
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const files = Array.from(input.files || []);
		this.handleFiles(files);
	}

	private handleFiles(files: File[]): void {
		this.clearMessages();

		if (files.length === 0) return;

		// If multiple is false, only take the first file
		const filesToProcess = this.config().multiple ? files : [files[0]];

		for (const file of filesToProcess) {
			if (!this.validateFile(file)) return;
			this.uploadFile(file);
		}
	}

	private validateFile(file: File): boolean {
		const config = this.config();

		// Check file size
		if (config.maxFileSize && file.size > config.maxFileSize) {
			this.errorMessage.set(
				`File "${file.name}" is too large. Maximum size is ${this.formatFileSize(config.maxFileSize)}.`
			);
			return false;
		}

		// Check file type
		if (config.acceptedTypes && config.acceptedTypes.length > 0) {
			const isAccepted = config.acceptedTypes.some(type => {
				if (type.startsWith('.')) {
					return file.name.toLowerCase().endsWith(type.toLowerCase());
				}
				return file.type.match(type.replace('*', '.*'));
			});

			if (!isAccepted) {
				this.errorMessage.set(
					`File "${file.name}" is not an accepted file type. Accepted types: ${config.acceptedTypes.join(', ')}`
				);
				return false;
			}
		}

		return true;
	}

	private uploadFile(file: File): void {
		const config = this.config();
		
		this.fileService.uploadFile(file, config.uploadedById).subscribe({
			next: (response: FileResponse | null) => {
				if (response) {
					this.uploadedFiles.update(files => [...files, response]);
					this.successMessage.set(`File "${response.originalName}" uploaded successfully!`);
					this.fileUploaded.emit(response);
					
					// Clear success message after 3 seconds
					setTimeout(() => this.successMessage.set(''), 3000);
				}
			},
			error: (error: Error) => {
				console.error('Upload error:', error);
				this.errorMessage.set(`Failed to upload "${file.name}". Please try again.`);
				this.uploadError.emit(error.message || 'Upload failed');
			}
		});
	}

	downloadFile(file: FileResponse): void {
		this.fileService.downloadAndSaveFile(file.id, file.originalName).subscribe({
			error: (error: Error) => {
				console.error('Download error:', error);
				this.errorMessage.set(`Failed to download "${file.originalName}".`);
			}
		});
	}

	deleteFile(fileId: string): void {
		this.fileService.deleteFile(fileId).subscribe({
			next: () => {
				this.uploadedFiles.update(files => files.filter(f => f.id !== fileId));
				this.successMessage.set('File deleted successfully!');
				this.fileDeleted.emit(fileId);
				
				// Clear success message after 3 seconds
				setTimeout(() => this.successMessage.set(''), 3000);
			},
			error: (error: Error) => {
				console.error('Delete error:', error);
				this.errorMessage.set('Failed to delete file. Please try again.');
			}
		});
	}

	isImage(mimetype: string): boolean {
		return this.fileService.isImage(mimetype);
	}

	formatFileSize(bytes: number): string {
		return this.fileService.formatFileSize(bytes);
	}

	getPreviewUrl(fileId: string): string {
		return this.fileService.getPreviewUrl(fileId);
	}

	private clearMessages(): void {
		this.errorMessage.set('');
		this.successMessage.set('');
	}
}
