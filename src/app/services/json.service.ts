import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  http = inject(HttpClient)

  async httpGet<T = NonNullable<unknown>>(url: string, opts: {
    withCredentials: boolean
  }): Promise<T> {
    const get = this.http.get(url, {
      responseType: 'json',
      withCredentials: opts.withCredentials,
    });
    const res: unknown | undefined = await get.toPromise();
    return res as T;
  }

  async httpPost<T = NonNullable<unknown>>(url: string, data: unknown, opts: {
    withCredentials: boolean
  }): Promise<T> {
    const get = this.http.post(url, data, {
      responseType: 'json',
      withCredentials: opts.withCredentials,
    });
    const res: unknown | undefined = await get.toPromise();
    return res as T;
  }
}