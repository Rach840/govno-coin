interface Terms {
    title: string;
    text?: stirng;
    content: {
        subtitle1: string;
        list: {
            listTitle: string;
            subList: string[];
        }[];
        subtitle2: string;
    }[];
}

interface News {
    title: string;
    content: string;
    source: string;
    date?: Date;
}

interface UserResponse {
    id: number;
    first_name: string;
    last_name?: string;
    photo_url?: string;
    username?: string;
}

interface User {
    id: number;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    userName?: string;
}

interface Product {
    id: number;
    skin_name: string;
    skin_price: string;
    skin_emission: number;
    skin_url: string;
}

interface MoneyValues {
    usd: number;
    govno: number;
}
