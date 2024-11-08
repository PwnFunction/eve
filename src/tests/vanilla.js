let events = [];

const isNumber = (value) => {
  try {
    return !isNaN(parseFloat(value));
  } catch (e) {
    return false;
  }
};

const handler = {
  set: function (obj, prop, value) {
    if (isNumber(prop)) {
      console.log(`set obj[${prop}] = ${value}`);
    }

    obj[prop] = value;
    return true;
  },

  get: function (obj, prop) {
    if (isNumber(prop)) {
      console.log(`get obj[${prop}] = ${obj[prop]}`);
    }

    return obj[prop];
  },
};

let proxy = new Proxy(events, handler);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function eventStream() {
  for (let i = 0; i < 10; i++) {
    await delay(1000);
    proxy.push(i);
  }
}

async function consumer() {
  for (let i = 0; i < 10; i++) {
    await delay(1000);
    console.log(proxy[i]);
  }
}

eventStream(), consumer();
