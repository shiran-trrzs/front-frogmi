import { Component } from '@angular/core';
import { PortalService } from './services/portal.service';
import { featureElement, featureFinalObject } from './models/interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-frogmi';
  isResultSuccessful: boolean = false;
  isResultUnsuccessful: boolean = false;
  isObtainDataUnsuccessful: boolean = false;
  isLoadingData: boolean = false;

  constructor(
    private portalService: PortalService
  ) { }

  getAllFeatures() {
    this.isResultSuccessful = false;
    this.isResultUnsuccessful = false;
    this.isLoadingData = true;
    this.portalService.getTotalFeatures().subscribe(
      (value: any) => {
        const newVersionFeatures = value.features.map((feature: featureElement) => ({
          id: feature.id,
          type: feature.type,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: new Date(feature.properties.time).toISOString(),
          url: feature.properties.url,
          tsunami: feature.properties.tsunami !== 0,
          magType: feature.properties.magType,
          title: feature.properties.title,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1]
        })).filter((feature: featureFinalObject) => (
          feature.title &&
          feature.url &&
          feature.place &&
          feature.magType &&
          feature.longitude >= -180 && feature.longitude <= 180 &&
          feature.latitude >= -90 && feature.latitude <= 90 &&
          feature.magnitude >= -1 && feature.magnitude <= 10
        ));

        const blockSize = 1000;
        const blocks = this.sendInBlocks(newVersionFeatures, blockSize);

        blocks.forEach((block, index) => {
          this.sendDataToBD(block);
        });
      },
      (error) => {
        this.isLoadingData = false;
        this.isObtainDataUnsuccessful = true;
        console.log('error:', error);
      }
    )
  }

  sendDataToBD(body: any[]) {
    console.log('body', body);
    this.portalService.insertDataInBD(body).subscribe(
      (response) => {
        this.isResultSuccessful = true;
        this.isLoadingData = false;
        console.log('Datos enviados al backend:', response);
      },
      (error) => {
        this.isResultUnsuccessful = true;
        this.isLoadingData = false;
        console.error('Error al enviar datos al backend:', error);
      }
    );
  }

  sendInBlocks(array: any[], size: number) {
    const blocks = [];
    for (let i = 0; i < array.length; i += size) {
      blocks.push(array.slice(i, i + size));
    }
    return blocks;
  }
}
