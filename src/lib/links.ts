export const sitePath = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const revision = '746a1cc7d2602bc59df6096eac50508ded6ef49e';
export const sourceLink = (path: string) => `https://github.com/devisv505/Sound-Manager/blob/${revision}/${path}`;
