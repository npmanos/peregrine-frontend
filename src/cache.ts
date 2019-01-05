const DB_NAME = 'CACHE'
const DB_VERSION = 5

const EVENT_STORE = 'events'
const SCHEMA_STORE = 'schemas'

const initDB = (db: IDBDatabase) => {
  if (!db.objectStoreNames.contains(EVENT_STORE))
    db.createObjectStore(EVENT_STORE)
  if (!db.objectStoreNames.contains(SCHEMA_STORE))
    db.createObjectStore(SCHEMA_STORE)
}

const getDB = (dbName: string): Promise<IDBDatabase> =>
  new Promise(resolve => {
    const request = indexedDB.open(dbName, DB_VERSION)
    request.addEventListener('upgradeneeded', () => initDB(request.result))
    request.addEventListener('success', () => {
      request.result.addEventListener('error', errorEvent => {
        throw new Error(
          ((errorEvent.target as unknown) as { error: string }).error,
        )
      })
      resolve(request.result)
    })
  })

const db = getDB(DB_NAME)

interface CacheableResult<T> {
  fastest: Promise<T>
  fromNetwork: Promise<T>
  (cb: (data: T) => void): CacheableResult<T>
}

type CB<T> = (data: T) => void

const callAllCallbacks = <T>(callbacks: CB<T>[], result: T) => {
  callbacks.forEach(cb => cb(result))
}

export const cacheable = <T>(
  networkPromise: Promise<T>,
  saveToCache: (value: T) => void,
  retrieveCachedValue: () => Promise<T>,
): CacheableResult<T> => {
  const cachePromise = retrieveCachedValue()

  const callbacks: CB<T>[] = []

  const attachCallback = ((callback: CB<T>) => {
    callbacks.push(callback)
    return attachCallback
  }) as CacheableResult<T>

  const networkWithFallback = networkPromise.catch(networkError =>
    cachePromise.catch(() => Promise.reject(networkError)),
  )
  attachCallback.fromNetwork = networkWithFallback
  attachCallback.fastest = Promise.race([networkWithFallback, cachePromise])

  let hasNetworkResolved = false

  cachePromise.then(result => {
    if (!hasNetworkResolved) callAllCallbacks(callbacks, result)
  })

  networkPromise.then(result => {
    callAllCallbacks(callbacks, result)
    saveToCache(result)
    hasNetworkResolved = true
  })

  return attachCallback
}

export const transaction = <T = void>(
  storeName: string,
  handler: (store: IDBObjectStore) => T extends void ? void : IDBRequest<T>,
) =>
  new Promise<T>(async resolve => {
    const tx = (await db).transaction(storeName, 'readwrite')
    const handleResult = handler(tx.objectStore(storeName))
    if (handleResult) {
      ;(handleResult as IDBRequest<T>).onsuccess = event => {
        resolve(((event.target as unknown) as { result: T }).result)
      }
    } else {
      tx.oncomplete = () => resolve()
    }
  })
