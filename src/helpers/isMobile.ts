export const getIsMobile = (): boolean => {
    // Check if we're on the client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    const userAgent = navigator.userAgent || navigator.vendor || '';
    return /android|iphone|ipad|ipod/i.test(userAgent);
};
