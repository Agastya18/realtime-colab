import {Queue,Worker} from 'bullmq';

const sendMessageQueue = new Queue('sendMessageQueue', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});
export async function sendMessageToQueue(message: string, roomId: string) {
  await sendMessageQueue.add('sendMessage', { message, roomId });
}

const worker = new Worker('sendMessageQueue', async job => {
  const { message, roomId } = job.data;
  // Process the message and roomId
  console.log(`Sending message to room ${roomId}: ${message}`);
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});