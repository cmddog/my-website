import {Component, inject} from '@angular/core';
import {BreakpointService} from '@services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  imports: [],
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  protected readonly breakpointService = inject(BreakpointService);
}
