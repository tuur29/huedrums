import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';

import { DrumsPage } from './drums';
import { DrumDirective } from '../../directives/drum';
import { MoveableDirective } from '../../directives/moveable';
import { ResizableDirective } from '../../directives/resizable';
import { LoopableDirective } from '../../directives/loopable';

@NgModule({
  declarations: [
    DrumsPage,
    DrumDirective,
    MoveableDirective,
    ResizableDirective,
    LoopableDirective
  ],
  imports: [
    IonicPageModule.forChild(DrumsPage),
    TooltipsModule
  ],
  exports: [
    DrumsPage
  ]
})
export class SettingsPageModule { }
