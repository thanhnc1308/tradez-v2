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
