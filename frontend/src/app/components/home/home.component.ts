import { Component } from '@angular/core';
import {AboutMeComponent} from './about-me/about-me.component';
import {WipCardComponent} from "../wip-card/wip-card.component";
import {ChangeLogComponent} from "./feature-log/change-log.component";
import {DraggableContainerComponent} from '../draggable-container/draggable-container.component';

@Component({
  selector: 'app-home',
  imports: [
    AboutMeComponent,
    ChangeLogComponent,
    DraggableContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  displayIntroduction = true;
  displayChangelog = true;
}
