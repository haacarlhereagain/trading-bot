export class IncrId {
    private _id = 0;

    public get id(): number {
        return this._id;
    }

    public incr(): number {
        this._id++;

        return this.id;
    }

    public reset(): void {
        this._id = 0;
    }
}