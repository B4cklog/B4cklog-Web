export interface Cover {
    id: number;
    url: string;
}

export interface Platform {
    id: number;
    name: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Screenshot {
    id: number;
    url: string;
}

export interface Game {
    id: number;
    name: string;
    summary?: string;
    cover?: Cover;
    first_release_date?: number;
    platforms?: Platform[];
    genres?: Genre[];
    screenshots?: Screenshot[];
} 