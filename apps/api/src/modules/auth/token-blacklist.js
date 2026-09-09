const blacklistedTokens = new Set();

export function blacklistToken(token) {
    if (token) blacklistedTokens.add(token);
}

export function isTokenBlacklisted(token) {
    return blacklistedTokens.has(token);
}