import {Component, computed, ElementRef, input, OnDestroy, OnInit, output, signal, ViewChild} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-draggable-container',
  imports: [
    NgStyle
  ],
  templateUrl: './draggable-container.component.html',
  styleUrl: './draggable-container.component.scss'
})
export class DraggableContainerComponent implements OnInit, OnDestroy {
  closeButtonClicked = output();

  minWidth = input<number>();
  maxWidth = input<number>();
  prefWidth = input<number>();

  minHeight = input<number>();
  maxHeight = input<number>();
  prefHeight = input<number>();

  allowResize = input<boolean>(true);

  cardTitle = input<string>('Card');

  @ViewChild('cardEl', {static: true}) cardElRef!: ElementRef<HTMLElement>;

  private isDragging = false;
  private isResizing = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartLeft = 0;
  private dragStartTop = 0;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartW = 0;
  private resizeStartH = 0;

  readonly width = signal<number | null>(null);
  readonly height = signal<number | null>(null);
  readonly left = signal<number>(0);
  readonly top = signal<number>(0);

  readonly hasExplicitSize = computed(
    () => this.width() !== null || this.height() !== null
  );

  private boundMouseMove = this.onMouseMove.bind(this);
  private boundMouseUp = this.onMouseUp.bind(this);

  ngOnInit(): void {
    const pw = this.prefWidth();
    const ph = this.prefHeight();
    if (pw !== undefined) this.width.set(pw);
    if (ph !== undefined) this.height.set(ph);

    requestAnimationFrame(() => this.centerCard());
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
  }

  private centerCard(): void {
    const el = this.cardElRef.nativeElement;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    this.left.set(Math.max(0, (window.innerWidth - w) / 2));
    this.top.set(Math.max(0, window.innerHeight - h) / 2);
  }

  onHeaderMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.resize-handle')) return;
    event.preventDefault();
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragStartLeft = this.left();
    this.dragStartTop = this.top();
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  onResizeMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    const el = this.cardElRef.nativeElement;
    this.resizeStartW = el.offsetWidth;
    this.resizeStartH = el.offsetHeight;
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.performDrag(event);
    } else if (this.isResizing) {
      this.performResize(event);
    }
  }

  private onMouseUp(): void {
    this.isDragging = false;
    this.isResizing = false;
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.body.style.cursor = '';
  }

  private performDrag(event: MouseEvent): void {
    const el = this.cardElRef.nativeElement;
    const cardW = el.offsetWidth;
    const cardH = el.offsetHeight;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    const newLeft = this.dragStartLeft + dx;
    const newTop = this.dragStartTop + dy;
    const maxLeft = window.innerWidth - cardW;
    const maxTop = window.innerHeight - cardH;
    this.left.set(Math.min(Math.max(0, newLeft), maxLeft));
    this.top.set(Math.min(Math.max(0, newTop), maxTop));
  }

  private performResize(event: MouseEvent): void {
    const dx = event.clientX - this.resizeStartX;
    const dy = event.clientY - this.resizeStartY;

    let newW = this.resizeStartW + dx;
    let newH = this.resizeStartH + dy;

    const minW = this.minWidth();
    const maxW = this.maxWidth();
    const minH = this.minHeight();
    const maxH = this.maxHeight();

    if (minW !== undefined) newW = Math.max(minW, newW);
    if (maxW !== undefined) newW = Math.min(maxW, newW);
    if (minH !== undefined) newH = Math.max(minH, newH);
    if (maxH !== undefined) newH = Math.min(maxH, newH);

    newW = Math.min(newW, window.innerWidth - this.left());
    newH = Math.min(newH, window.innerHeight - this.top());

    this.width.set(Math.max(50, newW));
    this.height.set(Math.max(50, newH));
  }

  get cardStyles(): Record<string, string> {
    const styles: Record<string, string> = {
      left: `${this.left()}px`,
      top:  `${this.top()}px`,
    };
    const w = this.width();
    const h = this.height();
    if (w !== null) styles['width']  = `${w}px`;
    if (h !== null) styles['height'] = `${h}px`;
    return styles;
  }
}
