export interface UserEndpoint
  extends Omit<Omit<IUser, "createdAt">, "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;

  avatar: string | null;
  username: string;

  isAdmin: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private id: string;

  private avatar: string | null;
  private username: string;

  private isAdmin: boolean;

  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: IUser) {
    this.id = data.id;
    this.avatar = data.avatar;
    this.username = data.username;
    this.isAdmin = data.isAdmin;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get values() {
    return {
      id: this.id,
      avatar: this.avatar,
      username: this.username,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
