import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./resgister.js";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able create user", async () => {
    const { user } = await sut.execute({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should hash user password opon registration", async () => {
    const { user } = await sut.execute({
      name: "Vinicius",
      email: "viniciusteste@gmail.com",
      password: "123456",
    });

    return {
      user,
    };
  });
});
