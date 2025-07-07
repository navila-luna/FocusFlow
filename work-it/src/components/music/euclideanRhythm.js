// import * as Tone from 'tone';

// class EuclideanRhythm {
//   bjorklund(n, k) {
//     let pulseSequence = Array.from({length: n}, (_, i) => i < k? [1] : [0])
//     while(n - k > 1) {
//       let left = 0;
//       k = Math.min(k, n-k)
//       while(left < k && left < pulseSequence.length) {
//         pulseSequence[left] = pulseSequence[left].concat(pulseSequence.pop());
//         left++;
//       }
//       n = pulseSequence.length;
//     }
//     const flattened = pulseSequence.flat();
//     const pulseCounts = [];
//     let curCount = 0;

//     for(const n of flattened) {
//       if (n === 1 && curCount > 0) {
//         pulseCounts.push(curCount);
//         curCount = 0;
//       }
//       curCount++;
//     }
//     pulseCounts.push(curCount);
//     return pulseCounts;
//   }

//   // This function will play a euclidean pattern on a given sound given a sound, n, and a k
//   makeRhythmPart(n, k, player) {

//   let euclideanSequence = bjorklund(n, k)
//   euclideanSequence = new Array(4).fill(euclideanSequence).flat();

//   // 3, 2, 3, 2, 3

//   // let testing = euclideanSequence.map((num) => [num + "n",'C4'])

//   let startTime = 0;

//   let testing = [];

//   euclideanSequence.forEach((num) => {

//   let endTime = num + startTime;

//   testing.push([startTime + ":" + endTime, 'C4']);

//   startTime += num;

//   });


//   // Create a sequence with the pulse sequence and player

//   const pulseBeat = new Tone.Part((time, note) => {

//     // console.log(time, ":time");

//     player.start(time);

//     }, testing);

//     pulseBeat.playbackRate = 16;

//     return pulseBeat;

//   }

// }



// export default EuclideanRhythm;