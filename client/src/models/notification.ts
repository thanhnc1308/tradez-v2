import BaseModel from "./BaseModel";

export default class notification extends BaseModel {
    user_id: string;
    condition_key: string;
    condition_description?: string;
    description?: string;
    gmail?: string;
    tg_chat_id?: string;
    send_gmail?: string;
    send_telegram?: string;
}
