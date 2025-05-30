import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateFileDto {
	@ApiProperty({ description: 'Original filename', example: 'document.pdf' })
	@IsString()
	@IsNotEmpty()
	originalName!: string;

	@ApiProperty({ description: 'MIME type of the file', example: 'application/pdf' })
	@IsString()
	@IsNotEmpty()
	mimetype!: string;

	@ApiProperty({ description: 'File size in bytes', example: 1024 })
	@IsInt()
	@Min(0)
	size!: number;

	@ApiPropertyOptional({ description: 'ID of the user uploading the file' })
	@IsOptional()
	@IsUUID()
	uploadedById?: string;
}

export class UpdateFileDto {
	@ApiPropertyOptional({ description: 'New filename', example: 'renamed-document.pdf' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	filename?: string;

	@ApiPropertyOptional({ description: 'New original name', example: 'new-document.pdf' })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	originalName?: string;
}

export class FileResponseDto {
	@ApiProperty({ description: 'Unique file ID' })
	id!: string;

	@ApiProperty({ description: 'Current filename' })
	filename!: string;

	@ApiProperty({ description: 'Original filename' })
	originalName!: string;

	@ApiProperty({ description: 'MIME type' })
	mimetype!: string;

	@ApiProperty({ description: 'File size in bytes' })
	size!: number;

	@ApiProperty({ description: 'Upload timestamp' })
	createdAt!: Date;

	@ApiProperty({ description: 'Last update timestamp' })
	updatedAt!: Date;

	@ApiPropertyOptional({ description: 'ID of the user who uploaded the file' })
	uploadedById?: string;
}

export class FileListResponseDto {
	@ApiProperty({ type: [FileResponseDto] })
	files!: FileResponseDto[];

	@ApiProperty({ description: 'Total number of files' })
	total!: number;

	@ApiProperty({ description: 'Current page number' })
	page!: number;

	@ApiProperty({ description: 'Number of files per page' })
	limit!: number;
}

export class FileQueryDto {
	@ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({ description: 'Number of files per page', example: 10, default: 10 })
	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number = 10;

	@ApiPropertyOptional({ description: 'Filter by MIME type', example: 'image/jpeg' })
	@IsOptional()
	@IsString()
	mimetype?: string;

	@ApiPropertyOptional({ description: 'Filter by uploader user ID' })
	@IsOptional()
	@IsUUID()
	uploadedById?: string;

	@ApiPropertyOptional({ description: 'Search in filename or original name' })
	@IsOptional()
	@IsString()
	search?: string;
}
