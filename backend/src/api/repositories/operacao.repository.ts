import { Operacao } from "@prisma/client";
import prisma from "../../../prisma";
import { TOperacaoAutomacao } from "../../types/operacaoAutomacao.type";

class OperacaoRepository {
  static async UpsertAutomacao(values: TOperacaoAutomacao[]) {
    return await prisma.$transaction(
      values.map((value) =>
        prisma.operacao.upsert({
          where: { key: value.key },
          create: { ...value },
          update: {
            issueId: value.issueId,
            date: value.date,
            nomeCliente: value.nomeCliente,
            nomeMotorista: value.nomeMotorista,
            cpfMotorista: value.cpfMotorista,
            origemDestino: value.origemDestino,
            placas: value.placas,
            nf: value.nf,
            pedido: value.pedido,
            qtdePlts: value.qtdePlts,
            freteLiquido: value.freteLiquido,
          },
        }),
      ),
    );
  }

  static async GetAll() {
    return await prisma.operacao.findMany({
      where: { ativo: true },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });
  }

  static async UpdateById(id: number, operacao: Partial<Operacao>) {
    try {
      return await prisma.operacao.update({ where: { id }, data: operacao });
    } catch (e: any) {
      if (e?.code === "P2025") return null;
      throw e;
    }
  }

  static async DeleteById(id: number) {
    try {
      await prisma.operacao.update({ where: { id }, data: { ativo: false } });
      return true;
    } catch (e: any) {
      if (e?.code === "P2025") return false;
      throw e;
    }
  }

  static async GetById(id: number) {
    return await prisma.operacao.findUnique({ where: { id } });
  }
}

export default OperacaoRepository;
