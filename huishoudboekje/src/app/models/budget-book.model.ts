export class BudgetBook {
    id: string;
    name: string;
    description: string;
    archived: boolean;

    constructor(id: string, name: string, description: string, archived: boolean = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.archived = archived;
    }

}
