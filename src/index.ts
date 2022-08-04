import amqp from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';
import { ConfirmChannel } from 'amqplib';

export class EmailSenderClient {
  private connection: IAmqpConnectionManager;
  private readonly queue: string;
  private channel: ConfirmChannel;

  constructor(urls: string[], queue = 'emails', connect = true) {
    this.queue = queue;
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
  async connect(urls: string[]) {
    this.connection = amqp.connect(urls);
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
    return new Promise((resolve) => {
      this.connection.createChannel({
        setup: (channel: ConfirmChannel) => {
          channel.assertQueue(this.queue).then((_e) => {
            resolve(channel);
          });
        },
      });
    });
  }

  /**
   * This function will send emails-infos into a queue which will be sent from another client
   * @param data - Data with email info to send
   * @author Nico W.
   * @async
   * @version 1.0.0
   * @since 04.08.2022
   */
  public sendEmail(data: {
    content: Record<string, string>;
    templateName: string;
  }) {
    return new Promise((resolve, reject) => {
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(data)),
        {},
        (err, ok) => {
          if (err) return reject(err);
          resolve(ok);
        }
      );
    });
  }
}
