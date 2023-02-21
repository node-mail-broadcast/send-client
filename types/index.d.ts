import { SendEmailByTemplatesIdRequest } from '@node-mail-broadcast/node-mailer-ts-api';
export declare class EmailSenderClient {
    private connection;
    private readonly queue;
    private apiUrl;
    private urls;
    private channel;
    private api;
    constructor(urls: string[], apiUrl?: string, queue?: string, connect?: boolean);
    connect(urls?: string[]): Promise<void>;
    private createChannelAndAssertQueue;
    sendEmail(method: 'HTTP' | 'AMQP', data: SendEmailByTemplatesIdRequest): Promise<unknown>;
}
