interface TsMapHelper {
    dataType: string;
    value: Array<Object>;
}

function replacer(key: string, value: Object): TsMapHelper | Object {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } else {
        return value;
    }
}

// Workaround for the fact that js/ts can't serialize/deserialize maps
export function stringify(o: any): string {
    return JSON.stringify(o, replacer);
}