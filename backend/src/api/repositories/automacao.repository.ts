import prisma from "../../../prisma";

class AutomacaoRepository {
  static async Insert(nome: string) {
    return await prisma.runsAutomacao.create({
      data: { automacao: nome },
    });
  }

  static async GetAll() {
    return await prisma.runsAutomacao.findMany({
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    });
  }

  static async GetAllByNome(nome: string) {
    return await prisma.runsAutomacao.findMany({
      where: { automacao: nome },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    });
  }

  static async GetLastByNome(nome: string) {
    return await prisma.runsAutomacao.findFirst({
      where: { automacao: nome },
      orderBy: [{ criadoEm: "desc" }, { id: "desc" }],
    });
  }
}

export default AutomacaoRepository;
