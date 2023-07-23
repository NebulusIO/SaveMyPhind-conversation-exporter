import {iconListeners} from "./background/icon/iconMain";
import {clickActionListener} from "./background/action/actionMain";
import {sleep} from "./activeTab/utils/utils";

clickActionListener();
iconListeners();


// getMessage fromBtnInContentScript (longueur de la liste)
//   pour $i < longueur de la liste
//     lancer le threadFromList $i : welcome + extract + export + clickOn($i ème elt)

let currentIndex = 0;
let lengthList = 0;
let isExporting = false;
let eventCount = 0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'exportAllThreads') {
    isExporting = true;
    currentIndex = 0;
    lengthList = request.length;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function(response) {
        console.log(response);
      });
    });
    setTimeout(function() {
      sendResponse({message: 'exportAllThreads started'});
    }, 1);
  }

  if (request.message === 'LOAD_COMPLETE') {
    eventCount++;
    if (eventCount % 2 === 0) {
      if (isExporting) {
        if (currentIndex >= lengthList) {
          isExporting = false;
          sendResponse({message: 'exportAllThreads finished'});
          return;
        }

        // sleep(2000).then(() => {
        currentIndex++;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          if (currentIndex < lengthList) {
            chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: currentIndex}, function (response) {
              console.log(response);
            });
          }
        });
        setTimeout(function () {
          sendResponse({message: 'LOAD_COMPLETE processed'});
        }, 1);

        // });
      }
      else
      {
        setTimeout(function() {
          sendResponse({message: 'LOAD_COMPLETE processed'});
        }, 1);
      }
    }
    else
    {
      setTimeout(function() {
        sendResponse({message: 'Before load complete'});
      }, 1);
    }
  }
  return true;
});

















// BEGINS TO WORK vvvvv
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     let promises = [];
//     for (let i = 0; i < request.length; i++) {
//       let promise = new Promise((resolve, reject) => {
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//           chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//             console.log(response);
//             resolve();
//           });
//         });
//       });
//       promises.push(promise);
//     }
//     Promise.all(promises).then(() => sendResponse({message: 'All scripts executed'}));
//     return true; // will respond asynchronously
//   }
//   if (request.message === 'READY') {
//     // Handle READY message
//   }
//   return true; // will respond asynchronously
// });






























// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//         if (request.message === 'READY') {
//           chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//               console.log(response);
//             });
//           });
//           // chrome.scripting.executeScript({
//           //   args: [i],
//           //   target: {tabId: getTabId(), allFrames : true},
//           //   func: threadFromList
//           // });
//         }
//         return true;
//       });
//     }
//     return true; // will respond asynchronously
//   }
// });















// // background.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {message: 'executeScript', index: i}, function(response) {
//           console.log(response);
//         });
//       });
//     }
//     return true; // will respond asynchronously
//   }
//   if (request.message === 'READY') {
//     console.log('Content script is ready');
//   }
//   return true; // will respond asynchronously
// });









































//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === 'exportAllThreads') {
//     console.log("exportAllThreads");
//     for (let i = 0; i < request.length; i++)
//     {
//       chrome.runtime.sendMessage({message: 'clickOnThread', index: i}, function(response) {
//         console.log(response);
//
//         chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//           if (changeInfo.status === 'complete') {
//             chrome.tabs.sendMessage(tabId, {message: 'exportCurrentThread'}, function(response) {
//               console.log(response);
//             });
//           }
//         });
//
//       });
//     }
//     return true; // will respond asynchronously
//   }
// });
//
// // vvvvvvvvvvvvv TODO: test
// //chrome.runtime.onMessage.addListener(
// //   function(request, sender, sendResponse) {
// //     if (request.message === 'READY') {
// //       console.log('Content script is ready');
// //     }
// //     if (request.message === 'exportAllThreads') {
// //       console.log("exportAllThreads");
// //       for (let i = 0; i < request.length; i++) {
// //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// //           var tabId = tabs[0].id;
// //           chrome.runtime.sendMessage({message: 'clickOnThread', index: i}, function(response) {
// //             console.log(response);
// //
// //             const checkIfContentLoaded = setInterval(() => {
// //               chrome.tabs.sendMessage(tabId, {message: 'checkIfContentExists'}, function(responseExists) {
// //                 if (responseExists) {
// //                   clearInterval(checkIfContentLoaded);
// //                   chrome.tabs.sendMessage(tabId, {message: 'exportCurrentThread'}, function(response) {
// //                     console.log(response);
// //                   });
// //                 }
// //               });
// //             }, 2000);  // checks every 2 seconds
// //           });
// //         });
// //       }
// //     }
// //     return true; // will respond asynchronously
// //   }
// // );