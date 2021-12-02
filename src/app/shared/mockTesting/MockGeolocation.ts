export default class MockGeolocation {
  getCurrentPosition(): Promise<any> {
    const dados: any = {
      coords: {
        latitude: 123456,
        longitude: 123456,
      }
    };
    return Promise.resolve(dados);
  }
}
