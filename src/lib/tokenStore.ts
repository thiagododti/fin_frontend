// access_token fica apenas em memória (nunca serializado em storage)
// refresh_token fica em sessionStorage (escopo por aba, limpo ao fechar o browser)
let _accessToken: string | null = null;

export const tokenStore = {
    getAccessToken: () => _accessToken,

    setAccessToken: (token: string | null) => {
        _accessToken = token;
    },

    getRefreshToken: () => sessionStorage.getItem("refresh_token"),

    setRefreshToken: (token: string | null) => {
        if (token) sessionStorage.setItem("refresh_token", token);
        else sessionStorage.removeItem("refresh_token");
    },

    clear: () => {
        _accessToken = null;
        sessionStorage.removeItem("refresh_token");
    },
};
