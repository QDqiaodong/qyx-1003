export function formatDate(timestamp) {
    if (!timestamp) return '无';
    const date = new Date(timestamp);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
}

export function isExpired(timestamp) {
    if (!timestamp) return false;
    return new Date(timestamp) < new Date();
}

export function isNearExpiry(timestamp) {
    if (!timestamp) return false;
    const now = new Date();
    const expiry = new Date(timestamp);
    const diff = expiry - now;
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
}
