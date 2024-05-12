export class BudgetBook {
    name: string;
    description: string;
    archived: boolean;

    constructor(name: string, description: string, archived: boolean = false) {
        this.name = name;
        this.description = description;
        this.archived = archived;
    }

}
