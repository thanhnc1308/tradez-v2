export const formatDate = (date: Date | string): string => {
    if (!!date) {
        if (date instanceof Date) {
            return `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`;
        } else if (typeof date === 'string') {
            return date;
        }
    } else {
        return '';
    }
};

export const formatDateTime = (date: Date | string): string => {
    if (!!date) {
        if (date instanceof Date) {
            return date.toLocaleString('en-GB');
        } else if (typeof date === 'string') {
            return date;
        }
    } else {
        return '';
    }
};

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export const toThousandFilter = (num: number) => {
    return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
};

export const timeAgo = (time) => {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
};

/**
 * Show plural label if time is plural number
 */
export const pluralize = (time: number, label: string): string => {
    if (time === 1) {
        return time + label;
    }
    return time + label + 's';
};
