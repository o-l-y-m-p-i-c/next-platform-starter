export const getIsMobile = (): boolean => {
    const userAgent = navigator.userAgent || navigator.vendor || '';
    return /android|iphone|ipad|ipod/i.test(userAgent);
};
