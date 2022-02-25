import { EnumColumnType, EnumFormatType } from './enum';

export type ColumnType = {
    key?: string;
    label?: string;
    width?: string | number;
    columnAlign?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    dataAlign?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    columnType?: EnumColumnType;
    formatType?: EnumFormatType;
};

export const columnsJournal: ColumnType[] = [
    {
        key: 'transaction_date',
        label: 'Date',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.DateTime,
        formatType: EnumFormatType.DateTime
    },
    {
        key: 'symbol',
        label: 'Symbol',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Link,
        formatType: EnumFormatType.Text
    },
    {
        key: 'transaction_type',
        label: 'Type',
        columnAlign: 'center',
        dataAlign: 'center',
        width: '80',
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'entry',
        label: 'Entry price',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    },
    {
        key: 'exit',
        label: 'Exit price',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    },
    {
        key: 'pnl',
        label: 'PnL',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.SignedTag,
        formatType: EnumFormatType.AbsPercentage
    },
    {
        key: 'screenshot',
        label: 'Screenshot',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 150,
        columnType: EnumColumnType.Image,
        formatType: EnumFormatType.Text
    },
    {
        key: 'comments',
        label: 'Comments',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 200,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    }
];

export const columnsNotification = [
    {
        key: 'created_at',
        label: 'Date',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.DateTime,
        formatType: EnumFormatType.DateTime
    },
    {
        key: 'description',
        label: 'Description',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 300,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'gmail',
        label: 'Gmail',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 300,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'send_gmail',
        label: 'Send Gmail',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Boolean,
        formatType: EnumFormatType.Text
    }
];

export const columnsStockPrice = [
    {
        key: 'symbol',
        label: 'Symbol',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 120,
        columnType: EnumColumnType.Link,
        formatType: EnumFormatType.Text
    },
    {
        key: 'volatile',
        label: 'Volatile',
        columnAlign: 'center',
        dataAlign: 'center',
        minWidth: 200,
        columnType: EnumColumnType.SignedTag,
        formatType: EnumFormatType.AbsPercentage
    }
];

export const columnsHistoricalPrice = [
    {
        key: 'stock_date',
        label: 'Date',

        columnAlign: 'center',
        dataAlign: 'center',
        width: 120,
        columnType: EnumColumnType.DateTime,
        formatType: EnumFormatType.DateTime
    },
    {
        key: 'symbol',
        label: 'Symbol',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 120,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'open_price',
        label: 'Open',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    },
    {
        key: 'high_price',
        label: 'High',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    },
    {
        key: 'low_price',
        label: 'Low',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    },
    {
        key: 'close_price',
        label: 'Close',
        columnAlign: 'center',
        dataAlign: 'center',
        minWidth: 100,
        columnType: EnumColumnType.Number,
        formatType: EnumFormatType.Number
    }
];

export const columnsStockScreener = [
    {
        key: 'symbol',
        label: 'Symbol',
        columnAlign: 'center',
        dataAlign: 'center',
        minWidth: 120,
        columnType: EnumColumnType.Link,
        formatType: EnumFormatType.Text
    }
];

export const columnsBacktestResult = [
    {
        key: 'transaction_date',
        label: 'Transaction Date',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 150,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'transaction_type',
        label: 'Transaction Type',
        columnAlign: 'center',
        dataAlign: 'center',
        width: 250,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    },
    {
        key: 'description',
        label: 'Description',
        columnAlign: 'center',
        dataAlign: 'center',
        minWidth: 200,
        columnType: EnumColumnType.Text,
        formatType: EnumFormatType.Text
    }
];
