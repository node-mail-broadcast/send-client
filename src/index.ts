import amqp from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';
import { ConfirmChannel } from 'amqplib';
import { Api } from './lib/Api';
import { SendEmailByTemplatesIdRequest } from '@node-mail-broadcast/node-mailer-ts-api';

export class EmailSenderClient {
  private connection: IAmqpConnectionManager;
  private readonly queue: string;
  private apiUrl = 'http://rest-api';
  private urls: string[];
  private channel: ConfirmChannel;
  private api: Api;

  constructor(
    urls: string[],
    apiUrl = 'http://rest-api',
    queue = 'emails',
    connect = true
  ) {
    this.apiUrl = apiUrl;
    this.urls = urls;
    this.queue = queue;
    this.api = new Api(this.apiUrl);
    if (connect) this.connect(urls);
  }

  /**
   * Connect to the amqp server and initialize connection
   * wrapper function for Creating channel ad asserting to queue
   * @async
   * @return Promise
   * @author Nico W.
   * @version 1.0.0
   * @since 0.2.0 04.07.2021
   */
  async connect(urls?: string[]) {
    //check if api is available
    this.api.checkApiVersion();
    //connect to amqp
    if (urls) this.urls = urls;
    this.connection = amqp.connect(this.urls);
    this.channel = await this.createChannelAndAssertQueue();
  }

  /**
   * This function actually creates the channel and asserts to the queue
   * @return ConfirmChannel - as **Promise**
   * @author Nico W.
   * @async
   * @version 1.0.0
   * @since 0.0.2 04.07.2022
   */
  private createChannelAndAssertQueue(): Promise<ConfirmChannel> {
    return new Promise((resolve, reject) => {
      this.connection.createChannel({
        setup: (channel: ConfirmChannel) => {
          channel
            .assertQueue(this.queue)
            .then((_e) => {
              resolve(channel);
            })
            .catch(reject);
        },
      });
    });
  }

  /**
   * This function will send emails-infos into a queue which will be sent from another client
   * @param method - Which send method to use
   * @param data - Data with email info to send
   * @author Nico W.
   * @async
   * @version 1.1.0
   * @since 04.08.2022
   */
  public sendEmail(
    method: 'HTTP' | 'AMQP',
    data: SendEmailByTemplatesIdRequest
  ) {
    if (method === 'HTTP') {
      return this.api.sendMail(data as SendEmailByTemplatesIdRequest);
    }
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(data)),
        {},
        (err, _ok) => {
          if (err) return reject(err);
          resolve(true);
        }
      );
    });
  }
}
