export function isJson(pseudoJson: string): boolean {
    try {
        JSON.parse(pseudoJson);
        return true;
    } catch(error) {
        if (error instanceof SyntaxError) {
            return false;
        }
        throw error;
    }
}

export * from './prefixable-console';
