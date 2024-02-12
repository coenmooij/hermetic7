import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

const CANVAS_SIZE: number = 256;
const SUPPORTED_PRINCIPLES:number[] = [1,4];

@Component({
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('canvas') public canvas?: ElementRef<HTMLCanvasElement>;
  public principle: number = 0;

  public ngOnInit(): void {
    this.pickRandomNumber();
  }

  public ngAfterViewInit(): void {
    this.drawUniverse();
  }

  private pickRandomNumber(): void {
    while(!SUPPORTED_PRINCIPLES.includes(this.principle)) {
      this.principle = Math.floor(Math.random() * 7) + 1;
    }
  }

  private drawUniverse(): void {
    if(!this.canvas) {
      return;
    }
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const centerX: number = CANVAS_SIZE / 2;
    const centerY: number = CANVAS_SIZE / 2;

    context.moveTo(centerX, centerY);
    context.beginPath();
    for (let i: number = 0; i < CANVAS_SIZE * 8; i++) {
      let angle: number = .1 * i;
      const x: number = centerX + angle * Math.cos(angle);
      const y: number = centerY + angle * Math.sin(angle);

      context.lineTo(x, y);
    }
    context.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context.strokeStyle = 'black';
    context.stroke();
  }
}
