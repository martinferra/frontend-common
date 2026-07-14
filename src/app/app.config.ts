import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { appRoutes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { getAuthHeaderFn } from "@martinferra/frontend-common/interceptors/header.interceptor";
import { getCatchErrorFn } from "@martinferra/frontend-common/interceptors/http-error.interceptor";
import { AuthService } from "@martinferra/frontend-common/shared/services/auth/auth.service";
import { ComponentResolverService } from "@martinferra/frontend-common/models/component-resolver.service";

function appInitializerFactory(authService: AuthService) {
  return () => {
    return authService.checkTheUserOnTheFirstLoad();
  };
}

const httpInterceptors = [
  getAuthHeaderFn(),
  getCatchErrorFn(),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors(httpInterceptors)),
    provideAnimations(),
    provideMomentDateAdapter(),
    ComponentResolverService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AuthService],
    }
  ],
};