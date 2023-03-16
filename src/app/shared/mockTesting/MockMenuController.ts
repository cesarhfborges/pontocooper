export default class MockMenuController {
  enable(status: boolean, id?: string): Promise<any> {
    return Promise.resolve();
  }

  isOpen(): Promise<boolean> {
    return Promise.resolve(true);
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}
