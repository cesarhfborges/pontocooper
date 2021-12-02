export default class MockScreenOrientation {
  lock(orientation: string): Promise<any> {
    return Promise.resolve();
  }

  unlock(): void {
  };
}
