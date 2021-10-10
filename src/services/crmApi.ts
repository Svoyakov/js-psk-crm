interface Iobject {
    [key: string]: any
}

class CrmApi {
    #timer = 10000

    #timeout: null | number = null

    #url = 'http://api.psktitan.ru'

    private static instance: CrmApi

    constructor() {
      if (CrmApi.instance) {
        return CrmApi.instance
      }
      CrmApi.instance = this
    }

    async getCanbanData(catId: number): Promise<Iobject> {
      return new Promise<Iobject>((resolve, reject) => {
        if (this.#timeout) clearTimeout(this.#timeout)
        this.#timeout = setTimeout(() => {
          throw new Error('timeout getCanbanData')
        }, this.#timer)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${this.#url}/post/getCanbanData.php`, true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(`catId=${catId}`)
        xhr.onload = () => {
          if (this.#timeout) clearTimeout(this.#timeout)
          if (xhr.status === 200) {
            try {
              const r = JSON.parse(decodeURIComponent(xhr.response.replace(/\+/g, ' ')))
              resolve(r)
            } catch (err) {
              reject(new Error(JSON.stringify(err)))
            }
          } else {
            reject(new Error(JSON.stringify(xhr)))
          }
        }
        xhr.onerror = () => {
          reject(new Error(JSON.stringify(xhr)))
        }
      })
    }

    async sendAndGetData(changes: Iobject): Promise<Iobject> {
      return new Promise<Iobject>((resolve, reject) => {
        if (this.#timeout) clearTimeout(this.#timeout)
        this.#timeout = setTimeout(() => {
          throw new Error('timeout sendAndGetData')
        }, this.#timer)

        const changesEncoded = encodeURIComponent(JSON.stringify(changes))
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${this.#url}/post/changeGetFromTables.php`, true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(`changes=${changesEncoded}`)
        xhr.onload = () => {
          if (this.#timeout) clearTimeout(this.#timeout)
          if (xhr.status === 200) {
            try {
              const r = JSON.parse(decodeURIComponent(xhr.response.replace(/\+/g, ' ')))
              resolve(r)
            } catch (err) {
              reject(new Error(JSON.stringify(err)))
            }
          } else {
            reject(new Error(JSON.stringify(xhr)))
          }
        }
        xhr.onerror = () => {
          reject(new Error(JSON.stringify(xhr)))
        }
      })
    }
}

export default CrmApi
