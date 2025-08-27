declare var require: {
    context(
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
    ): {
        keys(): string[];
        <T>(id: string): T;
        resolve(id: string): string;
    };
};

interface Translation {
    "default": { [key: string]: string };
}

export const translations: { [key: string]: Translation } = {};
export var currentLanguage: string = "en";

export const loadTranslations = async () => {
    const context = require.context('@/translations', false, /\.yaml$/);
    const translationFiles: { [key: string]: Translation } = {};
  
    context.keys().forEach((key: string) => {
        const language = key.replace('./', '').replace('.yaml', '');
        translationFiles[language] = context(key);
        console.log(`Loaded translations for ${language}:`, translationFiles[language]);
    });

    Object.assign(translations, translationFiles);
};

export const translate = (key: string, ...values: any[]): string => {
    if(!translations[currentLanguage]) {
        return key;
    }

    // Look for translation in current language
    let translation = undefined;
    if(!translations[currentLanguage]["default"].hasOwnProperty(key)) {
        return key;
    } else {
        translation = translations[currentLanguage]["default"][key];
    }
    
    if (!translation && currentLanguage !== "en") {
        translation = translations["en"]?.["default"]?.[key];
    }
    
    if (!translation) { // Return key if not found
        return key;
    }

    // Replace placeholders with values
    return translation.replace(/{(\d+)}/g, (match, number) => {
        return values[number] !== undefined ? values[number] : match;
    });
}

export const changeLanguage = async (language: string) => {
    currentLanguage = language;
};