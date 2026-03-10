import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { RegisterUseCase } from "@/use-cases/resgister.js";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repositories.js";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUserRepository();
    const resgisterUserCase = new RegisterUseCase(usersRepository);

    await resgisterUserCase.execute({
      name,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send();
  }

  return reply.status(201).send();
}
