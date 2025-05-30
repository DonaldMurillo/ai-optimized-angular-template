import { Component, ChangeDetectionStrategy, computed, signal, input, OnInit, inject } from '@angular/core';
import { FileService, FileResponse, FileListResponse, FileQueryParams } from '@ai-optimized-angular-template/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ui-file-manager',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="w-full">
			<!-- Header -->
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
					File Manager
				</h2>
				<div class="flex items-center space-x-2">
					<span class="text-sm text-gray-500 dark:text-gray-400">
						{{ totalFiles() }} files total
					</span>
				</div>
			</div>

			<!-- Filters -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Search -->
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Search
						</label>
						<input
							type="text"
							[(ngModel)]="searchTerm"
							placeholder="Search files..."
							(ngModelChange)="onSearchChange($event)"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<!-- MIME Type Filter -->
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							File Type
						</label>
						<select
							[(ngModel)]="selectedMimeType"
							(ngModelChange)="onMimeTypeChange($event)"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="">All types</option>
							<option value="image/">Images</option>
							<option value="application/pdf">PDF</option>
							<option value="text/">Text files</option>
							<option value="application/">Applications</option>
						</select>
					</div>

					<!-- Page Size -->
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Per Page
						</label>
						<select
							[(ngModel)]="pageSize"
							(ngModelChange)="onPageSizeChange($event)"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
					</div>

					<!-- Actions -->
					<div class="flex items-end">
						<button
							(click)="refreshFiles()"
							[disabled]="isLoading()"
							class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
							@if (isLoading()) {
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2 inline-block"></div>
							}
							Refresh
						</button>
					</div>
				</div>
			</div>

			<!-- Loading State -->
			@if (isLoading() && files().length === 0) {
				<div class="flex items-center justify-center py-12">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<span class="ml-2 text-gray-600 dark:text-gray-400">Loading files...</span>
				</div>
			}

			<!-- Files Grid -->
			@if (!isLoading() || files().length > 0) {
				@if (files().length > 0) {
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
						@for (file of files(); track file.id) {
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
								<!-- File Preview -->
								<div class="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
									@if (isImage(file.mimetype)) {
										<img 
											[src]="getPreviewUrl(file.id)" 
											[alt]="file.originalName"
											class="w-full h-full object-cover"
											(error)="onImageError($event)">
									} @else {
										<div class="text-center">
											<svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
											</svg>
											<span class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
												{{ getFileExtension(file.originalName) }}
											</span>
										</div>
									}
								</div>

								<!-- File Info -->
								<div class="p-3">
									<h3 class="font-medium text-gray-900 dark:text-gray-100 text-sm truncate mb-1" 
										[title]="file.originalName">
										{{ file.originalName }}
									</h3>
									<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
										{{ formatFileSize(file.size) }} • {{ formatDate(file.createdAt) }}
									</p>
									
									<!-- Actions -->
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-1">
											<button
												(click)="downloadFile(file)"
												class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
												title="Download">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
											</button>
											@if (isImage(file.mimetype) || isDocument(file.mimetype)) {
												<button
													(click)="previewFile(file)"
													class="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium transition-colors duration-200"
													title="Preview">
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</button>
											}
										</div>
										<button
											(click)="deleteFile(file)"
											class="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors duration-200"
											title="Delete">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						}
					</div>

					<!-- Pagination -->
					@if (totalPages() > 1) {
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<button
									(click)="goToPage(currentPage() - 1)"
									[disabled]="currentPage() <= 1"
									class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
									Previous
								</button>
								
								<span class="text-sm text-gray-700 dark:text-gray-300">
									Page {{ currentPage() }} of {{ totalPages() }}
								</span>

								<button
									(click)="goToPage(currentPage() + 1)"
									[disabled]="currentPage() >= totalPages()"
									class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
									Next
								</button>
							</div>

							<div class="text-sm text-gray-500 dark:text-gray-400">
								Showing {{ getShowingStart() }} to {{ getShowingEnd() }} of {{ totalFiles() }} files
							</div>
						</div>
					}
				} @else {
					<div class="text-center py-12">
						<svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
							<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No files found</h3>
						<p class="text-gray-500 dark:text-gray-400 mb-4">No files match your current filters.</p>
						@if (hasFilters()) {
							<button 
								(click)="clearFilters()" 
								class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
								Clear filters
							</button>
						}
					</div>
				}
			}

			<!-- Error Message -->
			@if (errorMessage()) {
				<div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
					<p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
				</div>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent implements OnInit {
	private readonly fileService = inject(FileService);

	// Inputs
	readonly userId = input<string>();

	// State
	readonly files = signal<FileResponse[]>([]);
	readonly totalFiles = signal<number>(0);
	readonly currentPage = signal<number>(1);
	readonly isLoading = signal<boolean>(false);
	readonly errorMessage = signal<string>('');

	// Filters
	readonly searchTerm = signal<string>('');
	readonly selectedMimeType = signal<string>('');
	readonly pageSize = signal<number>(10);

	// Computed properties
	readonly totalPages = computed(() => Math.ceil(this.totalFiles() / this.pageSize()));
	readonly hasFilters = computed(() => 
		this.searchTerm().length > 0 || this.selectedMimeType().length > 0
	);

	// Expose Math for template
	readonly Math = Math;

	getShowingStart(): number {
		return ((this.currentPage() - 1) * this.pageSize()) + 1;
	}

	getShowingEnd(): number {
		return Math.min(this.currentPage() * this.pageSize(), this.totalFiles());
	}

	ngOnInit(): void {
		this.loadFiles();
	}

	onSearchChange(term: string): void {
		this.searchTerm.set(term);
		this.currentPage.set(1);
		this.debouncedSearch();
	}

	onMimeTypeChange(type: string): void {
		this.selectedMimeType.set(type);
		this.currentPage.set(1);
		this.loadFiles();
	}

	onPageSizeChange(size: number): void {
		this.pageSize.set(size);
		this.currentPage.set(1);
		this.loadFiles();
	}

	goToPage(page: number): void {
		if (page >= 1 && page <= this.totalPages()) {
			this.currentPage.set(page);
			this.loadFiles();
		}
	}

	refreshFiles(): void {
		this.loadFiles();
	}

	clearFilters(): void {
		this.searchTerm.set('');
		this.selectedMimeType.set('');
		this.currentPage.set(1);
		this.loadFiles();
	}

	downloadFile(file: FileResponse): void {
		this.fileService.downloadAndSaveFile(file.id, file.originalName).subscribe({
			error: (error: Error) => {
				console.error('Download error:', error);
				this.errorMessage.set(`Failed to download "${file.originalName}".`);
				this.clearErrorAfterDelay();
			}
		});
	}

	previewFile(file: FileResponse): void {
		const previewUrl = this.fileService.getPreviewUrl(file.id);
		window.open(previewUrl, '_blank');
	}

	deleteFile(file: FileResponse): void {
		if (confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
			this.fileService.deleteFile(file.id).subscribe({
				next: () => {
					// Remove from local state
					this.files.update(files => files.filter(f => f.id !== file.id));
					this.totalFiles.update(total => total - 1);
					
					// If current page is empty and not the first page, go to previous page
					if (this.files().length === 0 && this.currentPage() > 1) {
						this.currentPage.update(page => page - 1);
						this.loadFiles();
					}
				},
				error: (error: Error) => {
					console.error('Delete error:', error);
					this.errorMessage.set(`Failed to delete "${file.originalName}".`);
					this.clearErrorAfterDelay();
				}
			});
		}
	}

	isImage(mimetype: string): boolean {
		return this.fileService.isImage(mimetype);
	}

	isDocument(mimetype: string): boolean {
		return this.fileService.isDocument(mimetype);
	}

	formatFileSize(bytes: number): string {
		return this.fileService.formatFileSize(bytes);
	}

	formatDate(date: Date): string {
		return new Date(date).toLocaleDateString();
	}

	getFileExtension(filename: string): string {
		const lastDotIndex = filename.lastIndexOf('.');
		return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1).toUpperCase() : 'FILE';
	}

	getPreviewUrl(fileId: string): string {
		return this.fileService.getPreviewUrl(fileId);
	}

	onImageError(event: Event): void {
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
	}

	private loadFiles(): void {
		this.isLoading.set(true);
		this.errorMessage.set('');

		const queryParams: FileQueryParams = {
			page: this.currentPage(),
			limit: this.pageSize(),
		};

		if (this.searchTerm()) {
			queryParams.search = this.searchTerm();
		}

		if (this.selectedMimeType()) {
			queryParams.mimetype = this.selectedMimeType();
		}

		const userId = this.userId();
		if (userId) {
			queryParams.uploadedById = userId;
		}

		const request = userId
			? this.fileService.getUserFiles(userId, queryParams)
			: this.fileService.getFiles(queryParams);

		request.subscribe({
			next: (response: FileListResponse) => {
				this.files.set(response.files);
				this.totalFiles.set(response.total);
				this.isLoading.set(false);
			},
			error: (error: Error) => {
				console.error('Load files error:', error);
				this.errorMessage.set('Failed to load files. Please try again.');
				this.isLoading.set(false);
			}
		});
	}

	private searchTimeoutId: ReturnType<typeof setTimeout> | undefined;
	private debouncedSearch(): void {
		clearTimeout(this.searchTimeoutId);
		this.searchTimeoutId = setTimeout(() => {
			this.loadFiles();
		}, 300) as ReturnType<typeof setTimeout>;
	}

	private clearErrorAfterDelay(): void {
		setTimeout(() => this.errorMessage.set(''), 5000);
	}
}
