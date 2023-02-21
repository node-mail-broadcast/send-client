//check if api connection is working
//export method to send email

import {
  Configuration,
  DefaultApi,
  SendEmailByTemplatesIdRequest,
} from '@node-mail-broadcast/node-mailer-ts-api';

export class Api {
  private readonly configuration: Configuration;
  private readonly defaultApi: DefaultApi;
  constructor(baseURL: string) {
    this.configuration = new Configuration({
      basePath: baseURL,
    });
    this.defaultApi = new DefaultApi(this.configuration);
  }
  checkApiVersion() {
    this.defaultApi
      .getVersion()
      .then((v) => {
        console.log(v.data.data.version);
      })
      .catch((x) => console.error(`[ERROR] - API not reachable: ${x} !`));
  }
  sendMail(obj: SendEmailByTemplatesIdRequest) {
    return this.defaultApi.sendEmailByTemplatesId({
      sendEmailByTemplatesIdRequest: obj,
    });
  }
}
