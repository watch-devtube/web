export class Timer {

  private start: [number, number];
  private label: string;
  private warnThresholdMs: number;

  constructor(label: string) {
    this.label = label;
    this.start = process.hrtime();
    this.warnThresholdMs = Number.MAX_SAFE_INTEGER;
  }

  withWarningIfSlow(): Timer {
    this.warnThresholdMs = 2000;
    return this;
  }

  print() {
    const elapsedMs = this.elapsed();
    console.debug(`${this.label}: ${elapsedMs}ms`);

    if (elapsedMs >= this.warnThresholdMs) {
      console.warn(`Slow ${this.label}: ${elapsedMs}ms`);
    }

  }

  private elapsed() {
    const [seconds, nanos] = process.hrtime(this.start);
    return Math.round(seconds * 1000 + nanos / 1000000);
  }

}