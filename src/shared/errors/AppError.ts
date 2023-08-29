class AppError {
  public readonly message: string;
  public readonly status: number;

  constructor(status = 400, message: string) {
    this.status = status;
    this.message = message;

  }
}

export default AppError;
