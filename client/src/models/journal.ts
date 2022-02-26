import BaseModel from './BaseModel';

export default class journal extends BaseModel {
    user_id: string;
    transaction_date: Date;
    symbol: string;
    transaction_type?: string;
    entry?: number;
    exit?: number;
    pnl?: number;
    screenshot?: string;
    comments?: string;

    constructor(newJournal) {
        super(newJournal);
        this.user_id = newJournal.user_id;
        this.transaction_date = newJournal.transaction_date;
        this.symbol = newJournal.symbol;
        this.transaction_type = newJournal.transaction_type;
        this.entry = newJournal.entry;
        this.exit = newJournal.exit;
        this.pnl = newJournal.pnl;
        this.screenshot = newJournal.screenshot;
        this.comments = newJournal.comments;
    }
}
