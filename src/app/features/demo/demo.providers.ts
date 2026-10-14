import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ProjectRepository } from './domain/repositories/project.repository';
import { ProjectRepositoryImpl } from './data/repositories/project-repository.impl';
import { PROJECT_DATASOURCE } from './data/datasources/project-datasource.interface';
import { ProjectMockDatasource } from './data/datasources/project-mock.datasource';
import { ProjectRemoteDatasource } from './data/datasources/project-remote.datasource';
import { ProjectStateService } from './application/state/project-state.service';
import { GetProjectsUseCase } from './application/use-cases/get-projects.use-case';
import { GetProjectByIdUseCase } from './application/use-cases/get-project-by-id.use-case';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { ConfigService } from '@core/config/config.service';

export function provideDemoFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Abstract domain repository bound to implementation
    {
      provide: ProjectRepository,
      useClass: ProjectRepositoryImpl,
    },
    // Isolated Datasource bound based on configuration (Mock or Remote)
    {
      provide: PROJECT_DATASOURCE,
      useFactory: (config: ConfigService) => {
        return config.isMockDataEnabled
          ? new ProjectMockDatasource()
          : new ProjectRemoteDatasource();
      },
      deps: [ConfigService],
    },
    // State & Use Cases
    ProjectStateService,
    GetProjectsUseCase,
    GetProjectByIdUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,
  ]);
}
