// access_token fica apenas em memória (nunca serializado em storage)
// refresh_token fica em localStorage (persiste entre abas e reinicializações do browser)
let _accessToken: string | null = null;

export const tokenStore = {
    getAccessToken: () => _accessToken,

    setAccessToken: (token: string | null) => {
        _accessToken = token;
    },

    getRefreshToken: () => localStorage.getItem("refresh_token"),

    setRefreshToken: (token: string | null) => {
        if (token) localStorage.setItem("refresh_token", token);
        else localStorage.removeItem("refresh_token");
    },

    clear: () => {
        _accessToken = null;
        localStorage.removeItem("refresh_token");
    },
};
