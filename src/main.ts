import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//start the app(like main)
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
