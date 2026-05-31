import { useEffect, useState } from 'react';
import { openDB, type IDBPDatabase } from 'idb';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// =====================================================================

const DB_NAME = 'quotation-backup';
const STORE = 'drafts';
const PK = 'new-quotation';
const DB_VERSION = 1;

// =====================================================================

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> | null {
  if (typeof indexedDB === 'undefined') {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      },
    });
  }

  return dbPromise;
}

// =====================================================================

function useQuotationBackup<T = unknown>() {
  // undefined = 載入中, null = 無備份, T = 有備份
  const [backup, setBackup] = useState<T | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const db = await getDB();

      if (!db) {
        !cancelled && setBackup(null);

        return;
      }

      try {
        const value = (await db.get(STORE, PK)) as T | undefined;
        !cancelled && setBackup(value ?? null);
      } catch (error) {
        console.error('讀取備份失敗:', error);
        !cancelled && setBackup(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateBackup = async (value: T) => {
    const db = await getDB();

    if (!db) {
      return;
    }

    try {
      await db.put(STORE, value, PK);
      setBackup(value);
    } catch (error) {
      myAlert.notify.error({
        message: '更新備份失敗',
      });
      console.error('更新備份失敗:', error);
    }
  };

  const clearBackup = async () => {
    const db = await getDB();

    if (!db) {
      return;
    }

    try {
      await db.delete(STORE, PK);
      setBackup(null);
    } catch (error) {
      myAlert.notify.error({
        message: '清除備份失敗',
      });
      console.error('清除備份失敗:', error);
    }
  };

  return { backup, updateBackup, clearBackup };
}

export { useQuotationBackup };
