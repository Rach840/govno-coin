interface TelegramWebApp {
    initData?: string;
    initDataUnsafe?: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
        };
        start_param: string;
    };

    expand(): void;

    requestFullscreen(): void;

    disableVerticalSwipes(): void;

    lockOrientation(): void;

    close(): void;

    ready(): void;

    showPopup(options: {
        title: string;
        message: string;
        buttons: Array<{
            text: string;
            type: string;
        }>;
    }): void;
}

interface Window {
    Telegram?: {
        WebApp?: TelegramWebApp;
    };
}
