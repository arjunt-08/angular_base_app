export type ProjectStatus = 'active' | 'planning' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly priority: ProjectPriority;
  readonly budget: number;
  readonly leadName: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type CreateProjectPayload = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectPayload = Partial<CreateProjectPayload>;
