import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

const CANVAS_SIZE: number = 256;

@Component({
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('universe') public universe?: ElementRef<HTMLCanvasElement>;
  @ViewChild('fractalTree') public fractalTree?: ElementRef<HTMLCanvasElement>;
  @ViewChild('vibrations') public vibrations?: ElementRef<HTMLCanvasElement>;
  @ViewChild('pendulum') public pendulum?: ElementRef<HTMLCanvasElement>;

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
    this.drawVibrations();
    this.drawPendulum();
  }

  private pickRandomNumber(): void {
    this.principle = this.randomNumber(1, 7);
  }

  private drawPendulum(): void {
    if (!this.pendulum) {
      return;
    }
    const context: CanvasRenderingContext2D = this.pendulum.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    const radius: number = 16;

    let ballOrbit: number = 1;
    let ballDirection: 'left' | 'right' = 'right';
    const pendulumLength: number = CANVAS_SIZE * .9;

    setInterval((): void => {
      if (ballDirection === 'left') {
        if (ballOrbit === 1) {
          ballDirection = 'right';
        } else {
          ballOrbit--;
        }
      } else if (ballOrbit === 180) {
        ballDirection = 'left';
      } else {
        ballOrbit++;
      }

      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.lineWidth = 2;
      context.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      context.stroke();

      context.lineWidth = 1;
      const x: number = this.calculateBallX(ballOrbit, radius);
      const deltaX: number = Math.abs(x - CANVAS_SIZE / 2);
      const y: number = Math.sqrt(Math.pow(pendulumLength, 2) - Math.pow(deltaX, 2));

      this.drawLine(context, CANVAS_SIZE / 2, 0, x, y);
      this.drawMoon(context, x, y, radius, 'sandybrown');
    }, 12);
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

    this.drawHalfCircle(context);
    this.drawHalfCircle(context);
    this.drawTree(context, CANVAS_SIZE / 2, CANVAS_SIZE / 2, -90, 11);
  }

  private drawVibrations(): void {
    if (!this.vibrations) {
      return;
    }
    const context: CanvasRenderingContext2D = this.vibrations.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    context.strokeStyle = 'black';

    const radius: number = 12;
    let orbit: number = 1;
    let direction: 'left' | 'right' = 'right';

    setInterval((): void => {
      direction === 'left' ? orbit-- : orbit++;
      if (orbit === 0) {
        direction = 'right';
      } else if (orbit === 180) {
        direction = 'left';
      }
      const ballX: number = this.calculateBallX(orbit, radius);
      const ballY: number = this.calculateMoonY(orbit, radius, direction);
      context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (direction === 'left') {
        this.drawMoon(context, ballX, ballY, radius, 'darkturquoise');
        this.drawPlanet(context, radius);
      } else {
        this.drawPlanet(context, radius);
        this.drawMoon(context, ballX, ballY, radius, 'turquoise');
      }
    }, 16);
  }

  private drawMoon(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string): void {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = color;
    context.fill();
    context.stroke();
  }

  private drawPlanet(context: CanvasRenderingContext2D, ballRadius: number): void {
    context.beginPath();
    context.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - ballRadius * 4, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = 'sandybrown';
    context.fill();
    context.stroke();
  }


  private calculateBallX(ballOrbit: number, ballRadius: number): number {
    return (ballOrbit / 180) * (CANVAS_SIZE - (ballRadius * 2)) + ballRadius;
  }

  private calculateMoonY(ballOrbit: number, ballRadius: number, direction: 'left' | 'right'): number {
    const amplitude: number = this.calculateAmplitude(ballOrbit) * ballRadius * 2;
    const directionFactor: number = direction === 'left' ? -1 : 1;
    return CANVAS_SIZE / 2 + (directionFactor * amplitude);
  }

  private calculateAmplitude(ballOrbit: number): number {
    return Math.sin(this.degreesToRadians(ballOrbit));
  }

  private drawTree(context: CanvasRenderingContext2D, xStart: number, yStart: number, angle: number, depth: number): void {

    const branchLength: number = this.randomNumber(0, 2);

    if (depth !== 0) {
      const xEnd: number = xStart + (this.cos(angle) * depth * branchLength);
      const yEnd: number = yStart + (this.sin(angle) * depth * branchLength);

      this.drawLine(context, xStart, yStart, xEnd, yEnd);
      this.drawTree(context, xEnd, yEnd, angle - this.randomNumber(15, 20), depth - 1);
      this.drawTree(context, xEnd, yEnd, angle + this.randomNumber(15, 20), depth - 1);
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
