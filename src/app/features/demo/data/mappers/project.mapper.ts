import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../../domain/models/project.model';
import { ProjectDto, CreateProjectRequestDto, UpdateProjectRequestDto } from '../dto/project.dto';

export class ProjectMapper {
  static toDomain(dto: ProjectDto): Project {
    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      budget: dto.budget_amount,
      leadName: dto.lead_name,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  static toDomainList(dtos: ProjectDto[]): Project[] {
    return dtos.map((dto) => ProjectMapper.toDomain(dto));
  }

  static toCreateDto(payload: CreateProjectPayload): CreateProjectRequestDto {
    return {
      code: payload.code,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      budget_amount: payload.budget,
      lead_name: payload.leadName,
    };
  }

  static toUpdateDto(payload: UpdateProjectPayload): UpdateProjectRequestDto {
    return {
      ...(payload.code !== undefined && { code: payload.code }),
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.priority !== undefined && { priority: payload.priority }),
      ...(payload.budget !== undefined && { budget_amount: payload.budget }),
      ...(payload.leadName !== undefined && { lead_name: payload.leadName }),
    };
  }
}
