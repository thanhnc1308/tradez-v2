import BaseModel from "./BaseModel";

export default class journal extends BaseModel {
    symbol: string;
    stock_date: string;
    currency_unit: string;
    open_price: number;
    high_price: number;
    low_price: number;
    close_price: number;
    volume: number;
}
