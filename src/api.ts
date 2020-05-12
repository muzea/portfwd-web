enum Url {
  ping = "/ping",
  list = "/proxy",
  add = "/proxy",
  patch = "/proxy/<localPort>",
  delete = "/proxy/<localPort>",
}

const Api = new (class API {
  host: string;
  port: number;
  setServer(host: string, port: number) {
    this.port = port;
    this.host = host;
  }
  getUrl(url: Url, query = {}) {
    const u = new URL(
      url.replace(/\<(.+?)\>/, (_, key) => query[key]),
      `http://${this.host}:${this.port}`
    );
    return u.toString();
  }
  async ping() {
    return (await fetch(this.getUrl(Url.ping))).json();
  }
  async list() {
    return (await fetch(this.getUrl(Url.list))).json();
  }
  async add(data = {}) {
    return (
      await fetch(this.getUrl(Url.add), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    ).json();
  }
  async update(data = {}) {
    return (
      await fetch(this.getUrl(Url.patch, data), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    ).json();
  }
  async delete(localPort) {
    return (
      await fetch(this.getUrl(Url.delete, { localPort }), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  }
})();

export { Api };
