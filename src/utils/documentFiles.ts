const DB_NAME = 'psykie-local-documents'
function openFiles(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('files')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
export async function storeDocumentFile(id: string, file: File): Promise<void> {
  const db = await openFiles()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readwrite')
    transaction.objectStore('files').put(file, id)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
  })
}
export async function getDocumentFile(id: string): Promise<File | undefined> {
  const db = await openFiles()
  return new Promise((resolve, reject) => {
    const request = db.transaction('files').objectStore('files').get(id)
    request.onsuccess = () => { db.close(); resolve(request.result as File | undefined) }
    request.onerror = () => { db.close(); reject(request.error) }
  })
}
export async function deleteDocumentFile(id: string): Promise<void> {
  const db = await openFiles()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('files', 'readwrite')
    transaction.objectStore('files').delete(id)
    transaction.oncomplete = () => { db.close(); resolve() }
    transaction.onerror = () => { db.close(); reject(transaction.error) }
    transaction.onabort = () => { db.close(); reject(transaction.error) }
  })
}
