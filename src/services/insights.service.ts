import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  private URL: string;
  constructor(private http: HttpClient) {}

  getData(ticker: string): Observable<Object> {
    this.URL = constants.domain + '/insights/' + ticker;
    return this.http.get(this.URL);
  }
}

export interface Insights {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  content: string;
}
