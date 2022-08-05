## @node-mail-broadcast/send-client

- NodeJS endpoint for sending emails with this framework

(more coming soon^TM)

### Example Usage

```typescript
import {EmailSenderClient} from "./index";

const emailClient = new EmailSenderClient(["amqp://url-to-broker"], "emails", false);
emailClient.connect().then(console.log, console.log);

//to send an email
emailClient.sendEmail({
    templateName: "some-name-from-database",
    content: {
        placeholder1: "value1",
        placeholder2: "value2"
    }
}).then(console.log, console.log)
```


&copy; 2022
