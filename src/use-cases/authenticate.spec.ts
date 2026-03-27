import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-errors.js";

describe("Authenticate Use Case", () => {
  it("Should be able to authenticate user", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "viniciusteste@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("Should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "viniciusfonseca553@gmail.com",
        password: "456788",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
