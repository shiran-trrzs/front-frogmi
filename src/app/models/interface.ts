export interface featureElement {
    geometry: {
        coordinates: number[],
        type: string,
    }
    id: string,
    properties: {
        mag: number,
        place: string,
        time: number,
        url: string,
        tsunami: number,
        magType: string,
        title: string
    },
    type: string
}

export interface featureFinalObject {
    id: string,
    magnitude: number,
    place: string,
    time: number,
    url: string,
    tsunami: boolean,
    magType: string,
    title: string,
    longitude: number,
    latitude: number
}