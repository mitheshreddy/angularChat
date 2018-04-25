export interface IUser {
    _id: string;
    name: string;
    availableInd: boolean;
    avatarSrc?: string;
}

export class User implements IUser {
    _id: string;
    name: string;
    availableInd: boolean;
    avatarSrc: string;

    constructor(id: string, name: string, availableInd?: boolean, avatarSrc?: string) {
        this._id = id;
        this.name = name;
        this.availableInd = availableInd || false;
        this.avatarSrc = avatarSrc || "male-avatar-1";
    }
}