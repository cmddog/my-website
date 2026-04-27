import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-draggable-container',
  imports: [NgStyle],
  templateUrl: './draggable-container.component.html',
  styleUrl: './draggable-container.component.scss',
})
export class DraggableContainerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  closeButtonClicked = output();

  minWidth = input<number>();
  maxWidth = input<number>();
  prefWidth = input<number>();

  minHeight = input<number>();
  maxHeight = input<number>();
  prefHeight = input<number>();

  resizable = input<boolean>(true);
  cardTitle = input<string>('Card');

  @ViewChild('cardEl', { static: true }) cardElRef!: ElementRef<HTMLElement>;
  readonly left = signal(0);
  readonly top = signal(0);
  readonly width = signal<number | null>(null); // null = fit-content
  readonly height = signal<number | null>(null);
  readonly zIndex = input<number>(0);
  // Drag state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartLeft = 0;
  private dragStartTop = 0;
  // Resize state
  private isResizing = false;
  private resizeStartX = 0;
  private resizeStartY = 0;
  private resizeStartW = 0;
  private resizeStartH = 0;

  get cardStyles(): Record<string, string> {
    return {
      left: `${this.left()}px`,
      top: `${this.top()}px`,
      zIndex: `${this.zIndex()}`,
      ...(this.width() !== null && { width: `${this.width()}px` }),
      ...(this.height() !== null && { height: `${this.height()}px` }),
    };
  }

  private get container(): HTMLElement {
    let el = this.cardElRef.nativeElement.parentElement;
    // Walks up from the card element to find the first ancestor with actual dimensions.
    // Needed because Angular host elements sit between #cardEl and .wrapper in the DOM
    // but have no size of their own.
    while (el && el.clientWidth === 0 && el.clientHeight === 0)
      el = el.parentElement;
    return el as HTMLElement;
  }

  private get el(): HTMLElement {
    return this.cardElRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.prefWidth() !== undefined) this.width.set(this.prefWidth()!);
    if (this.prefHeight() !== undefined) this.height.set(this.prefHeight()!);
    window.addEventListener('resize', this.onWindowResize);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.constrainCard();
        this.centerCard();
      });
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onHeaderMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragStartLeft = this.left();
    this.dragStartTop = this.top();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  // --- Event Listeners ---

  onResizeMouseDown(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isResizing = true;
    this.resizeStartX = e.clientX;
    this.resizeStartY = e.clientY;
    this.resizeStartW = this.el.offsetWidth;
    this.resizeStartH = this.el.offsetHeight;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private centerCard(): void {
    const { clientWidth: cW, clientHeight: cH } = this.container;
    this.left.set(
      Math.max(
        0,
        Math.min((cW - this.el.offsetWidth) / 2, cW - this.el.offsetWidth),
      ),
    );
    this.top.set(
      Math.max(
        0,
        Math.min((cH - this.el.offsetHeight) / 2, cH - this.el.offsetHeight),
      ),
    );
  }

  private constrainCard(): void {
    const { clientWidth: cW, clientHeight: cH } = this.container;
    const minW = this.minWidth() ?? 50;
    const minH = this.minHeight() ?? 50;

    if (this.el.offsetWidth > cW) this.width.set(Math.max(minW, cW));
    if (this.el.offsetHeight > cH) this.height.set(Math.max(minH, cH));

    requestAnimationFrame(() => {
      this.left.set(
        Math.min(this.left(), Math.max(0, cW - this.el.offsetWidth)),
      );
      this.top.set(
        Math.min(this.top(), Math.max(0, cH - this.el.offsetHeight)),
      );
    });
  }

  // --- Mouse Down Handlers ---

  private readonly onMouseMove = (e: MouseEvent) => {
    if (this.isDragging) this.performDrag(e);
    else if (this.isResizing) this.performResize(e);
  };

  private readonly onMouseUp = () => {
    this.isDragging = this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  // --- Drag & Resize ---

  private readonly onWindowResize = () => this.constrainCard();

  private performDrag(e: MouseEvent): void {
    const { clientWidth: cW, clientHeight: cH } = this.container;
    this.left.set(
      Math.min(
        Math.max(0, this.dragStartLeft + e.clientX - this.dragStartX),
        cW - this.el.offsetWidth,
      ),
    );
    this.top.set(
      Math.min(
        Math.max(0, this.dragStartTop + e.clientY - this.dragStartY),
        cH - this.el.offsetHeight,
      ),
    );
  }

  // --- Template Binding ---

  private performResize(e: MouseEvent): void {
    const { clientWidth: cW, clientHeight: cH } = this.container;
    let newW = this.resizeStartW + e.clientX - this.resizeStartX;
    let newH = this.resizeStartH + e.clientY - this.resizeStartY;

    newW = Math.min(
      Math.max(newW, this.minWidth() ?? 50),
      this.maxWidth() ?? Infinity,
      cW - this.left(),
    );
    newH = Math.min(
      Math.max(newH, this.minHeight() ?? 50),
      this.maxHeight() ?? Infinity,
      cH - this.top(),
    );

    this.width.set(newW);
    this.height.set(newH);
  }
}
