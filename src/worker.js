export default {
  async fetch(request) {
    // 👇 your temporary Gradio host (no protocol)
    const UPSTREAM_HOST = "94d77cee1c8dd786db.gradio.live";

    const inURL = new URL(request.url);
    const outURL = new URL(request.url);

    // Forward same path/query to the upstream host
    outURL.hostname = UPSTREAM_HOST;
    outURL.protocol = "https:";

    // Pass through WebSockets (Gradio uses them)
    if (request.headers.get("upgrade") === "websocket") {
      outURL.protocol = "wss:";
      return fetch(new Request(outURL, request));
    }

    // Proxy normal HTTP(S) traffic
    const init = {
      method: request.method,
      headers: new Headers(request.headers),
      redirect: "follow",
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    };

    // Stream back the upstream response
    return fetch(new Request(outURL, init));
  }
}
