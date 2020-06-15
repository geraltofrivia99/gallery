export function fetchImageData(src) {
    let userPromise = fetchImage(src);
    return {
      img: wrapPromise(userPromise),
    };
  }
  
  // Suspense integrations like Relay implement
  // a contract like this to integrate with React.
  // Real implementations can be significantly more complex.
  // Don't copy-paste this into your project!
  function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
    console.log('fetch')
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      }
    };
  }
  
  function fetchImage(src) {
    return new Promise((resolve, rej) => {
        const image = new Image(300, 200);
        image.onload = resolve();
        image.onerror = rej();
        image.src = src;
    });
  }
  