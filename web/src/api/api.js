function http(method = "GET", url = "", data = null, isStream = false) {
  const controller = new AbortController();
  const signal = controller.signal;

  var option = {
    method: method,
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      "Content-Type": isStream
        ? "application/x-www-form-urlencoded"
        : "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    signal,
  };

  if (data !== null) {
    if (data instanceof FormData) {
      option.body = data;
      delete option.headers;
    } else {
      option.body = JSON.stringify(data);
    }
  }

  var abort = false;
  const request = fetch(url, option).catch((err) => {
    if (err.name == "AbortError") abort = true;
    else throw err;
  });

  const wrapper = (request) => ({
    request,
    abort: () => controller.abort(),
    then: (callback) =>
      wrapper(request.then((rest) => !abort && callback(rest))),
    onabort: (callback) =>
      wrapper(request.finally((rest) => abort && callback(rest))),
    catch: (callback) =>
      wrapper(request.catch((rest) => !abort && callback(rest))),
  });

  return wrapper(request);
}

function jsonUnwrap(req) {
  return req
    .then((res) => res.json().then((data) => ({ data, status: res.status })))
    .then(({ data, status }) => {
      if (data.hasOwnProperty("streams")) return data;
      if (!data.status || status != 200) throw data;
      return data?.data;
    });
}

const baseUrl =
  process.env.NODE_ENV == "development" ? "http://localhost:1000" : "";

const wsUrl = "ws://" + window.location.hostname + ":" + 1001 + "/live";

export const ApiWrapper = () => {
  function get(path, body) {
    return jsonUnwrap(http("GET", `${baseUrl}/api/${path}`, body, false));
  }

  function post(path, body) {
    return jsonUnwrap(http("POST", `${baseUrl}/api/${path}`, body, false));
  }

  function put(path, body) {
    return jsonUnwrap(http("PUT", `${baseUrl}/api/${path}`, body, false));
  }

  function del(path, body) {
    return jsonUnwrap(http("DELETE", `${baseUrl}/api/${path}`, body, false));
  }

  return {
    WebRTCUrl: wsUrl,
    GetDrawerConfig: () => get("drawer"),
    SetDrawerConfig: (data) => post("drawer", data),
  };
};
