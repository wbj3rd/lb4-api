export interface NodeService {
  getGreeting(slogan: string): Promise<object>;
}
