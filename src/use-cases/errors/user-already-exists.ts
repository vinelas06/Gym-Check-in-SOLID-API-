export class UserAlreadyExistsError extends Error {
  constructor() {
    super("Usuário já existente no banco");
  }
}
