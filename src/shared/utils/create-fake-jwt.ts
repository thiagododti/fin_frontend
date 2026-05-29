/**
 * Cria um JWT falso para testes.
 *
 * @param time - Tempo em segundos até a expiração do token. Se menor ou igual a 0, o token já estará expirado.
 * @returns Uma string contendo um JWT falso com formato base64url.header.base64url.payload.fake-signature
 */
export function createFakeJwt(time: number) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };

    let payload: { [key: string]: undefined | number | string } = {
        user_id: '1',
        token_type: 'access',
        iat: Math.floor(Date.now() / 1000) - 3600, // Emitido há 1 hora
        jti: '1234567890',
    };

    if (time <= 0) {
        payload.exp = Math.floor(Date.now() / 1000) - 50; // Expirado há 50 segundos
    } else {
        payload.exp = Math.floor(Date.now() / 1000) + time;
    }

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

    return `${encodedHeader}.${encodedPayload}.fake-signature`;
}
