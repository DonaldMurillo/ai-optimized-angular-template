import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';

export interface FileUploadProgress {
	percentage: number;
	loaded: number;
	total: number;
}

export interface FileResponse {
	id: string;
	filename: string;
	originalName: string;
	mimetype: string;
	size: number;
	createdAt: Date;
	updatedAt: Date;
	uploadedById?: string;
}

export interface FileListResponse {
	files: FileResponse[];
	total: number;
	page: number;
	limit: number;
}

export interface FileQueryParams {
	page?: number;
	limit?: number;
	mimetype?: string;
	uploadedById?: string;
	search?: string;
}

@Injectable({
	providedIn: 'root'
})
export class FileService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = '/api/files';

	// Reactive state
	readonly uploadProgress = signal<FileUploadProgress | null>(null);
	readonly isUploading = signal<boolean>(false);
	readonly files = signal<FileResponse[]>([]);
	readonly totalFiles = signal<number>(0);
	readonly currentPage = signal<number>(1);
	readonly currentLimit = signal<number>(10);

	private readonly uploadProgress$ = new BehaviorSubject<FileUploadProgress | null>(null);

	/**
	 * Upload a file with progress tracking
	 */
	uploadFile(file: File, uploadedById?: string): Observable<FileResponse> {
		const formData = new FormData();
		formData.append('file', file);
		if (uploadedById) {
			formData.append('uploadedById', uploadedById);
		}

		this.isUploading.set(true);
		this.uploadProgress.set(null);

		return this.http.post<FileResponse>(`${this.baseUrl}/upload`, formData, {
			reportProgress: true,
			observe: 'events'
		}).pipe(
			map((event: HttpEvent<FileResponse>): FileResponse | null => {
				switch (event.type) {
					case HttpEventType.UploadProgress:
						if (event.total) {
							const progress: FileUploadProgress = {
								percentage: Math.round((event.loaded / event.total) * 100),
								loaded: event.loaded,
								total: event.total
							};
							this.uploadProgress.set(progress);
							this.uploadProgress$.next(progress);
						}
						return null;
					case HttpEventType.Response:
						this.isUploading.set(false);
						this.uploadProgress.set(null);
						this.uploadProgress$.next(null);
						if (event.body) {
							return event.body;
						}
						return null;
					default:
						return null;
				}
			}),
			filter((response: FileResponse | null): response is FileResponse => response !== null),
			catchError(error => {
				this.isUploading.set(false);
				this.uploadProgress.set(null);
				this.uploadProgress$.next(null);
				return throwError(() => error);
			})
		);
	}

	/**
	 * Get files with pagination and filtering
	 */
	getFiles(params: FileQueryParams = {}): Observable<FileListResponse> {
		const queryParams = new URLSearchParams();
		
		if (params.page) queryParams.set('page', params.page.toString());
		if (params.limit) queryParams.set('limit', params.limit.toString());
		if (params.mimetype) queryParams.set('mimetype', params.mimetype);
		if (params.uploadedById) queryParams.set('uploadedById', params.uploadedById);
		if (params.search) queryParams.set('search', params.search);

		const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;

		return this.http.get<FileListResponse>(url).pipe(
			tap(response => {
				this.files.set(response.files);
				this.totalFiles.set(response.total);
				this.currentPage.set(response.page);
				this.currentLimit.set(response.limit);
			}),
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Get file metadata by ID
	 */
	getFile(id: string): Observable<FileResponse> {
		return this.http.get<FileResponse>(`${this.baseUrl}/${id}`).pipe(
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Download file by ID
	 */
	downloadFile(id: string): Observable<Blob> {
		return this.http.get(`${this.baseUrl}/${id}/download`, {
			responseType: 'blob'
		}).pipe(
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Get file preview URL for images/documents
	 */
	getPreviewUrl(id: string): string {
		return `${this.baseUrl}/${id}/preview`;
	}

	/**
	 * Update file metadata
	 */
	updateFile(id: string, updates: { filename?: string; originalName?: string }): Observable<FileResponse> {
		return this.http.patch<FileResponse>(`${this.baseUrl}/${id}`, updates).pipe(
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Delete file by ID
	 */
	deleteFile(id: string): Observable<{ message: string }> {
		return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
			tap(() => {
				// Remove from local state
				const currentFiles = this.files();
				this.files.set(currentFiles.filter(file => file.id !== id));
				this.totalFiles.update(total => total - 1);
			}),
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Get files uploaded by a specific user
	 */
	getUserFiles(userId: string, params: Omit<FileQueryParams, 'uploadedById'> = {}): Observable<FileListResponse> {
		const queryParams = new URLSearchParams();
		
		if (params.page) queryParams.set('page', params.page.toString());
		if (params.limit) queryParams.set('limit', params.limit.toString());
		if (params.mimetype) queryParams.set('mimetype', params.mimetype);
		if (params.search) queryParams.set('search', params.search);

		const url = queryParams.toString() 
			? `${this.baseUrl}/user/${userId}?${queryParams}` 
			: `${this.baseUrl}/user/${userId}`;

		return this.http.get<FileListResponse>(url).pipe(
			tap(response => {
				this.files.set(response.files);
				this.totalFiles.set(response.total);
				this.currentPage.set(response.page);
				this.currentLimit.set(response.limit);
			}),
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Helper method to trigger file download with proper filename
	 */
	downloadAndSaveFile(id: string, filename?: string): Observable<void> {
		return this.downloadFile(id).pipe(
			map(blob => {
				// Create a temporary URL for the blob
				const url = window.URL.createObjectURL(blob);
				
				// Create a temporary anchor element to trigger download
				const link = document.createElement('a');
				link.href = url;
				link.download = filename || `file-${id}`;
				document.body.appendChild(link);
				link.click();
				
				// Clean up
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			}),
			catchError(error => throwError(() => error))
		);
	}

	/**
	 * Check if file type is an image
	 */
	isImage(mimetype: string): boolean {
		return mimetype.startsWith('image/');
	}

	/**
	 * Check if file type is a document
	 */
	isDocument(mimetype: string): boolean {
		const documentTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/plain',
			'text/csv'
		];
		return documentTypes.includes(mimetype);
	}

	/**
	 * Format file size for display
	 */
	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	/**
	 * Get upload progress observable for reactive updates
	 */
	getUploadProgress(): Observable<FileUploadProgress | null> {
		return this.uploadProgress$.asObservable();
	}
}
