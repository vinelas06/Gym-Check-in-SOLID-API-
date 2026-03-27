import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repositories.js";
import { AuthenticateUseCase } from "@/use-cases/authenticate.js";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-errors.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateRepository = new PrismaUserRepository();
    const authenticateUseCase = new AuthenticateUseCase(authenticateRepository);

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    return reply.status(500).send();
  }

  return reply.status(200).send();
}
