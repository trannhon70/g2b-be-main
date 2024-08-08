import path from 'path';

export const Font = {
    getFont: (fontName: string) => {
        const pathFont = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'static_files',
            'fonts',
            fontName,
        );

        return pathFont;
    },
};
