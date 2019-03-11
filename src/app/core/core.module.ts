import { NgModule, Optional, SkipSelf  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloConfigModule } from './../apollo-config.module';
import { Title } from '@angular/platform-browser';

@NgModule({
  exports: [
    BrowserAnimationsModule,
    ApolloConfigModule
  ],
  providers: [
    Title
  ]
})
export class CoreModule {

  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    /** valida para não deixar importar mais de uma vez */
    if (parentModule) {
      throw new Error('CoreModule já foi importardo. importe só no appModule.');
    }
   }

}
