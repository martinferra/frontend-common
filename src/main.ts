import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { environment } from './lib/environments/environment';
import { enableProdMode } from '@angular/core';
import { AppComponent } from '@martinferra/frontend-custom';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).then(() => {
    console.log('Application bootstrapped successfully');
}).catch(err => {
    console.error('Error bootstrapping application:', err);
});