export class UserService {
  private id: string;
  private username: string;
  private channel_id: string;

  constructor() {}

  private setChannelId(channel_id: string): void {
    this.channel_id = channel_id;
  }

  private setUsername(username: string): void {
    this.username = username;
  }

  private setId(id: string): void {
    this.id = id;
  }

  public save(username, id, channel_id) {
    this.setChannelId(channel_id);
    this.setUsername(username);
    this.setId(id);
    localStorage.setItem("currentUser", JSON.stringify(this));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  public getChannelId(): string {
    return this.channel_id;
  }
  public getUsername(): string {
    return this.username;
  }
  public getId(): string {
    return this.id;
  }
}
