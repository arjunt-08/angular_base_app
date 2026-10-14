export interface ProjectDto {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'planning' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget_amount: number;
  lead_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequestDto {
  code: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  budget_amount: number;
  lead_name: string;
}

export interface UpdateProjectRequestDto {
  code?: string;
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  budget_amount?: number;
  lead_name?: string;
}

export interface ProjectListResponseDto {
  items: ProjectDto[];
  total: number;
  page: number;
  page_size: number;
}
