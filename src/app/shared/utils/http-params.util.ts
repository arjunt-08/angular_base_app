import { HttpParams } from '@angular/common/http';

export function toHttpParams(params: Record<string, unknown>): HttpParams {
  let httpParams = new HttpParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined && item !== '') {
          httpParams = httpParams.append(key, String(item));
        }
      }
    } else {
      httpParams = httpParams.set(key, String(value));
    }
  }

  return httpParams;
}
