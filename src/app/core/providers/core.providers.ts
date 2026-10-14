import { EnvironmentProviders, ErrorHandler, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Environment } from '@env/environment.model';
import { APP_CONFIG } from '../config/app-config.token';
import { TOKEN_STORAGE } from '../auth/tokens/token-storage.interface';
import { TokenStorageService } from '../auth/services/token-storage.service';
import { GlobalErrorHandler } from '../http/error-handling/global-error-handler';
import { apiPrefixInterceptor } from '../http/interceptors/api-prefix.interceptor';
import { authInterceptor } from '../http/interceptors/auth.interceptor';
import { loggingInterceptor } from '../http/interceptors/logging.interceptor';
import { timeoutInterceptor } from '../http/interceptors/timeout.interceptor';
import { errorInterceptor } from '../http/interceptors/error.interceptor';

export function provideCore(environment: Environment): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_CONFIG,
      useValue: environment,
    },
    {
      provide: TOKEN_STORAGE,
      useClass: TokenStorageService,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideHttpClient(
      withInterceptors([
        apiPrefixInterceptor,
        authInterceptor,
        loggingInterceptor,
        timeoutInterceptor,
        errorInterceptor,
      ]),
    ),
  ]);
}
