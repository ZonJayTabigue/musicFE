// import '@testing-library/jest-dom/extend-expect';
// jest.setup.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { BroadcastChannel } from 'broadcast-channel';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.BroadcastChannel = BroadcastChannel;


class IntersectionObserver {
   constructor(callback) {
     this.callback = callback;
     this.observations = new Map();
   }
 
   observe(element) {
     this.observations.set(element, true);
   }
 
   unobserve(element) {
     this.observations.delete(element);
   }
 
   disconnect() {
     this.observations.clear();
   }
 
   trigger(entries) {
     this.callback(entries);
   }
 }
 
 // Mock IntersectionObserver in global scope
 global.IntersectionObserver = IntersectionObserver;
 