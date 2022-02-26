export default class BaseModel {
    id?: string

    constructor(newItem) {
        this.id = newItem.id;
    }
}
