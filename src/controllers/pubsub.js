const stan = require('node-nats-streaming').connect(process.env.CLUSTER_ID, process.env.CLIENT_ID, { 'url': process.env.NAT_URL });
const durableName = process.env.DURABLE_NAME || 'my-sub';

// Publisher endpoint
let postTask = (req, res) => {
  const msg = req.body;

  // Add timestamp
  msg.sendTime = Math.floor(Date.now() / 1000);
  const data = JSON.stringify(msg);

  stan.publish(process.env.SUBJECT, data, (err, guid) => {
    if (err) {
      console.log('Failed to publish', err);
      res.status(500).json({
        guid: guid,
        error: err
      });
    } else {
      console.log('published message with guid: ', guid);
      res.json({
        guid: guid,
        error: err
      });
    }

  });
};

// Subscriber worker
stan.on('connect', () => {
  console.log('Connection is now open');
  const opts = stan.subscriptionOptions();
  opts.setDeliverAllAvailable();
  opts.setDurableName(durableName);
  opts.setManualAckMode(true);
  opts.setAckWait(60 * 1000); //60s

  const sub = stan.subscribe(process.env.SUBJECT, opts);
  sub.on('message', async (msg) => {
    console.log('Received a message [' + msg.getSequence() + '] ' + msg.getData());
    await workerJob(msg.getData());
    console.log('Job done successfully');
    msg.ack();
  });
});

stan.on('close', () => {
  console.log('Connection is now closed');
});

stan.on('error', (err) => {
  console.log('Error:', err);
});

// Worker job
const workerJob = (obj) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(obj);
      resolve('foo');
    }, 300);
  });
};

module.exports = postTask;
