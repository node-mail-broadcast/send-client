export declare class EmailSenderClient {
  private connection;
  private readonly queue;
  private channel;
  constructor(urls: string[], queue?: string, connect?: boolean);
  connect(urls: string[]): Promise<void>;
  private createChannelAndAssertQueue;
  sendEmail(content: any): Promise<unknown>;
}
