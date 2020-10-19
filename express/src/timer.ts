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
    const elapsedMs = this.hrTimeToMillis(process.hrtime(this.start));
    console.debug(`${this.label}: ${elapsedMs}ms`);

    if (elapsedMs >= this.warnThresholdMs) {
      console.warn(`Slow ${this.label}: ${elapsedMs}ms`);
    }

  }

  private hrTimeToMillis(hrtime: [number, number]) {
    // magic taken from https://github.com/seriousManual/hirestime/blob/master/src/index.ts
    return Math.round(hrtime[0] * 1e3 + hrtime[1] / 1e6);
  }



}