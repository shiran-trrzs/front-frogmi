import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PortalService {

  constructor(
    private http: HttpClient,
  ) { }

  baseURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

  getTotalFeatures() {
    return this.http.get(this.baseURL);
  }

  insertDataInBD(data: any[]) {
    const url = 'http://localhost:3000/api/data';
    return this.http.post(url, data);
  }
}
