import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Recupera un valore dalla cache (AsyncStorage).
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            return JSON.parse(value) as T;
        }
        return null;
    } catch (e) {
        console.warn(`Error reading cache for key: ${key}`, e);
        return null;
    }
}

/**
 * Salva un valore nella cache.
 */
export async function setCache(key: string, value: any): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`Error setting cache for key: ${key}`, e);
    }
}

/**
 * Rimuove un valore specifico o multipli valori dalla cache.
 * Molto utile per invalidare dati "Stale" quando si effettua un'azione di modifica o cancellazione.
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const keysToRemove = keys.filter(k => k.startsWith(prefix));
        if (keysToRemove.length > 0) {
            await AsyncStorage.multiRemove(keysToRemove);
        }
    } catch (e) {
        console.warn(`Error invalidating cache for prefix: ${prefix}`, e);
    }
}
