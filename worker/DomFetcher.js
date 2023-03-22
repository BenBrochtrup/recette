import fetch from 'node-fetch'
import jsdom from 'jsdom'

const { JSDOM } = jsdom

class DomFetcher {
  constructor(url) {
    this.url = url
  }

  async retrieveDom() {
    const body = await fetch(this.url)
      .then(res => res.text())
      .then(body => body)

    const dom = new JSDOM(body)
    const doc = dom.window.document

    return doc
  }

  clearDom() { }
}

export default DomFetcher
