import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseInterceptors,
	UploadedFile,
	BadRequestException,
	Res,
	ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { FileService } from '@ai-optimized-angular-template/api-services';
import {
	CreateFileDto,
	UpdateFileDto,
	FileResponseDto,
	FileListResponseDto,
	FileQueryDto,
} from '@ai-optimized-angular-template/api-dtos';

interface MulterFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	size: number;
	buffer: Buffer;
}

@ApiTags('Files')
@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post('upload')
	@ApiOperation({ summary: 'Upload a new file' })
	@ApiConsumes('multipart/form-data')
	@ApiResponse({
		status: 201,
		description: 'File uploaded successfully',
		type: FileResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request' })
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: MulterFile,
		@Body('uploadedById') uploadedById?: string
	): Promise<FileResponseDto> {
		if (!file) {
			throw new BadRequestException('No file provided');
		}

		const createFileDto: CreateFileDto = {
			originalName: file.originalname,
			mimetype: file.mimetype,
			size: file.size,
			uploadedById,
		};

		return this.fileService.create(createFileDto, file.buffer);
	}

	@Get()
	@ApiOperation({ summary: 'Get all files with pagination and filtering' })
	@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
	@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
	@ApiQuery({ name: 'mimetype', required: false, type: String, description: 'Filter by MIME type' })
	@ApiQuery({ name: 'uploadedById', required: false, type: String, description: 'Filter by uploader' })
	@ApiQuery({ name: 'search', required: false, type: String, description: 'Search in filename' })
	@ApiResponse({
		status: 200,
		description: 'List of files retrieved successfully',
		type: FileListResponseDto,
	})
	async findAll(@Query() query: FileQueryDto): Promise<FileListResponseDto> {
		return this.fileService.findAll(query);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get file metadata by ID' })
	@ApiResponse({
		status: 200,
		description: 'File metadata retrieved successfully',
		type: FileResponseDto,
	})
	@ApiResponse({ status: 404, description: 'File not found' })
	async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FileResponseDto> {
		return this.fileService.findOne(id);
	}

	@Get(':id/download')
	@ApiOperation({ summary: 'Download file by ID' })
	@ApiResponse({
		status: 200,
		description: 'File downloaded successfully',
		content: {
			'application/octet-stream': {
				schema: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiResponse({ status: 404, description: 'File not found' })
	async downloadFile(
		@Param('id', ParseUUIDPipe) id: string,
		@Res() res: Response
	): Promise<void> {
		const { file, data } = await this.fileService.findOneWithData(id);

		res.set({
			'Content-Type': file.mimetype,
			'Content-Disposition': `attachment; filename="${file.originalName}"`,
			'Content-Length': file.size.toString(),
		});

		res.send(data);
	}

	@Get(':id/preview')
	@ApiOperation({ summary: 'Preview file by ID (inline content)' })
	@ApiResponse({
		status: 200,
		description: 'File preview retrieved successfully',
	})
	@ApiResponse({ status: 404, description: 'File not found' })
	async previewFile(
		@Param('id', ParseUUIDPipe) id: string,
		@Res() res: Response
	): Promise<void> {
		const { file, data } = await this.fileService.findOneWithData(id);

		res.set({
			'Content-Type': file.mimetype,
			'Content-Length': file.size.toString(),
			'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
		});

		res.send(data);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update file metadata' })
	@ApiResponse({
		status: 200,
		description: 'File metadata updated successfully',
		type: FileResponseDto,
	})
	@ApiResponse({ status: 404, description: 'File not found' })
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateFileDto: UpdateFileDto
	): Promise<FileResponseDto> {
		return this.fileService.update(id, updateFileDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete file by ID' })
	@ApiResponse({
		status: 200,
		description: 'File deleted successfully',
	})
	@ApiResponse({ status: 404, description: 'File not found' })
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
		await this.fileService.remove(id);
		return { message: 'File deleted successfully' };
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'Get files uploaded by a specific user' })
	@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
	@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
	@ApiQuery({ name: 'mimetype', required: false, type: String, description: 'Filter by MIME type' })
	@ApiQuery({ name: 'search', required: false, type: String, description: 'Search in filename' })
	@ApiResponse({
		status: 200,
		description: 'User files retrieved successfully',
		type: FileListResponseDto,
	})
	async findByUser(
		@Param('userId', ParseUUIDPipe) userId: string,
		@Query() query: Omit<FileQueryDto, 'uploadedById'>
	): Promise<FileListResponseDto> {
		return this.fileService.getFilesByUser(userId, query);
	}
}
