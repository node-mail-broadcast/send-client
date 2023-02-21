import { SendEmailByTemplatesIdRequest } from '@node-mail-broadcast/node-mailer-ts-api';
export declare class Api {
    private readonly configuration;
    private readonly defaultApi;
    constructor(baseURL: string);
    checkApiVersion(): void;
    sendMail(obj: SendEmailByTemplatesIdRequest): Promise<import("axios").AxiosResponse<void, any>>;
}
