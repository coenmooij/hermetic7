import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

const CANVAS_SIZE: number = 256;

@Component({
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('universe') public universe?: ElementRef<HTMLCanvasElement>;
  @ViewChild('fractalTree') public fractalTree?: ElementRef<HTMLCanvasElement>;

  public principle: number = 0;
  public links: string[] = [
    'https://en.wikipedia.org/wiki/The_Kybalion',
    'https://en.wikipedia.org/wiki/Hermes_Trismegistus',
    'https://en.wikipedia.org/wiki/Emerald_Tablet',
    'https://en.wikipedia.org/wiki/Corpus_Hermeticum',
    'https://en.wikipedia.org/wiki/Count_of_St._Germain',
    'https://en.wikipedia.org/wiki/Queen_of_Sheba',
    'https://en.wikipedia.org/wiki/Solomon'
  ];

  public ngOnInit(): void {
    this.pickRandomNumber();
  }

  public ngAfterViewInit(): void {
    this.drawUniverse();
    this.drawFractalTree();
  }

  private pickRandomNumber(): void {
    this.principle = this.randomNumber(1, 7);
  }

  private drawUniverse(): void {
    if (!this.universe) {
      return;
    }
    const context: CanvasRenderingContext2D = this.universe.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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

  private drawFractalTree(): void {
    if (!this.fractalTree) {
      return;
    }
    const context: CanvasRenderingContext2D = this.fractalTree.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    context.strokeStyle = 'black';
    context.fillStyle = 'sandybrown';
    context.lineWidth = 1;

    this.drawHalfCircle(context);
    this.drawHalfCircle(context);
    this.drawTree(context, CANVAS_SIZE / 2, CANVAS_SIZE / 2, -90, 11);


  }

  public drawTree(context: CanvasRenderingContext2D, xStart: number, yStart: number, angle: number, depth: number): void {

    const branchLength: number = this.randomNumber(0, 2);

    if (depth !== 0) {
      const x2: number = xStart + (this.cos(angle) * depth * branchLength);
      const y2: number = yStart + (this.sin(angle) * depth * branchLength);

      this.drawLine(context, xStart, yStart, x2, y2);
      this.drawTree(context, x2, y2, angle - this.randomNumber(15, 20), depth - 1);
      this.drawTree(context, x2, y2, angle + this.randomNumber(15, 20), depth - 1);
    }
  }

  public drawLine(context: CanvasRenderingContext2D, xStart: number, yStart: number, xEnd: number, yEnd: number): void {

    context.beginPath();

    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);

    context.closePath();
    context.stroke();
  }

  private drawHalfCircle(context: CanvasRenderingContext2D): void {
    context.moveTo(0, CANVAS_SIZE / 2);
    context.beginPath();
    context.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2, 460, 0);
    context.closePath();
    context.fill();
    context.stroke();
  }

  private cos(angle: number): number {
    return Math.cos(this.degreesToRadians(angle));
  }

  private sin(angle: number): number {
    return Math.sin(this.degreesToRadians(angle));
  }

  private degreesToRadians(angle: number): number {
    return angle * (Math.PI / 180.0);
  }

  private randomNumber(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max + 1 - min));
  }
}
