export default class NWException extends Error {
    code: string
    source: string

    constructor(code: string, source?: any, message ?: any) {
        super(message);
        this.code = code;
        this.source = source;
    }
    getCode() {
        return this.code;
    }
    getSource() {
        return this.source;
    }
}

