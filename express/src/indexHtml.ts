import { Request, Response } from "express";

import { DEFAULT_TITLE, DEFAULT_DESCR, DEFAULT_OG_IMG } from "./texts";

export class IndexHtml {
  title: string;
  descr: string;
  image: string;

  constructor(params = {} as any) {
    this.image = params.image || DEFAULT_OG_IMG;
    this.title = this.normalizeQuotes(params.title || DEFAULT_TITLE);
    this.descr = this.normalizeQuotes(params.descr || DEFAULT_DESCR);
  }

  render(req: Request, res: Response) {
    const attrs = {
      title: this.title,
    };
    res.render("index.html", attrs);
  }

  private normalizeQuotes(str: String) {
    return str.replace(/"/g, "'");
  }
}
