import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@ai-optimized-angular-template/prisma';
import { 
	CreateFileDto, 
	UpdateFileDto, 
	FileResponseDto, 
	FileListResponseDto, 
	FileQueryDto 
} from '@ai-optimized-angular-template/api-dtos';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createFileDto: CreateFileDto, fileBuffer: Buffer): Promise<FileResponseDto> {
		// Generate a unique filename to avoid conflicts
		const fileExtension = this.getFileExtension(createFileDto.originalName);
		const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;

		try {
			const file = await this.prisma.file.create({
				data: {
					filename: uniqueFilename,
					originalName: createFileDto.originalName,
					mimetype: createFileDto.mimetype,
					size: createFileDto.size,
					data: new Uint8Array(fileBuffer),
					uploadedById: createFileDto.uploadedById,
				},
			});

			return this.mapToResponseDto(file);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				throw new BadRequestException('Failed to save file to database');
			}
			throw error;
		}
	}

	async findAll(query: FileQueryDto): Promise<FileListResponseDto> {
		const { page = 1, limit = 10, mimetype, uploadedById, search } = query;
		const skip = (page - 1) * limit;

		const where: Prisma.FileWhereInput = {};

		if (mimetype) {
			where.mimetype = mimetype;
		}

		if (uploadedById) {
			where.uploadedById = uploadedById;
		}

		if (search) {
			where.OR = [
				{ filename: { contains: search, mode: 'insensitive' } },
				{ originalName: { contains: search, mode: 'insensitive' } },
			];
		}

		const [files, total] = await Promise.all([
			this.prisma.file.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					filename: true,
					originalName: true,
					mimetype: true,
					size: true,
					createdAt: true,
					updatedAt: true,
					uploadedById: true,
				},
			}),
			this.prisma.file.count({ where }),
		]);

		return {
			files: files.map(file => this.mapToResponseDto(file)),
			total,
			page,
			limit,
		};
	}

	async findOne(id: string): Promise<FileResponseDto> {
		const file = await this.prisma.file.findUnique({
			where: { id },
			select: {
				id: true,
				filename: true,
				originalName: true,
				mimetype: true,
				size: true,
				createdAt: true,
				updatedAt: true,
				uploadedById: true,
			},
		});

		if (!file) {
			throw new NotFoundException(`File with ID ${id} not found`);
		}

		return this.mapToResponseDto(file);
	}

	async findOneWithData(id: string): Promise<{ file: FileResponseDto; data: Buffer }> {
		const file = await this.prisma.file.findUnique({
			where: { id },
		});

		if (!file) {
			throw new NotFoundException(`File with ID ${id} not found`);
		}

		return {
			file: this.mapToResponseDto(file),
			data: Buffer.from(file.data),
		};
	}

	async update(id: string, updateFileDto: UpdateFileDto): Promise<FileResponseDto> {
		try {
			const file = await this.prisma.file.update({
				where: { id },
				data: updateFileDto,
				select: {
					id: true,
					filename: true,
					originalName: true,
					mimetype: true,
					size: true,
					createdAt: true,
					updatedAt: true,
					uploadedById: true,
				},
			});

			return this.mapToResponseDto(file);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`File with ID ${id} not found`);
				}
			}
			throw error;
		}
	}

	async remove(id: string): Promise<void> {
		try {
			await this.prisma.file.delete({
				where: { id },
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`File with ID ${id} not found`);
				}
			}
			throw error;
		}
	}

	async getFilesByUser(userId: string, query: Omit<FileQueryDto, 'uploadedById'>): Promise<FileListResponseDto> {
		return this.findAll({ ...query, uploadedById: userId });
	}

	private getFileExtension(filename: string): string {
		const lastDotIndex = filename.lastIndexOf('.');
		return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
	}

	private mapToResponseDto(file: {
		id: string;
		filename: string;
		originalName: string;
		mimetype: string;
		size: number;
		createdAt: Date;
		updatedAt: Date;
		uploadedById: string | null;
	}): FileResponseDto {
		return {
			id: file.id,
			filename: file.filename,
			originalName: file.originalName,
			mimetype: file.mimetype,
			size: file.size,
			createdAt: file.createdAt,
			updatedAt: file.updatedAt,
			uploadedById: file.uploadedById ?? undefined,
		};
	}
}
