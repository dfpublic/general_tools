const DEFAULT_CONFIG = {
    API_URL: 'http://localhost:3333'
}
const PRODUCTION_CONFIG = {
    API_URL: 'https://generaltoolsapi.conradk.now.sh'
}
export const CONFIG = new Proxy({
    API_URL: DEFAULT_CONFIG.API_URL
}, {
    get(obj, prop) {
        let config;
        switch (process.env.NODE_ENV) {
            case 'production':
                config = {
                    ...DEFAULT_CONFIG,
                    ...PRODUCTION_CONFIG
                }
                break;
            default:
            case 'development':
                config = {
                    ...DEFAULT_CONFIG
                }
                break;
        }
        return config[prop];
    }
})