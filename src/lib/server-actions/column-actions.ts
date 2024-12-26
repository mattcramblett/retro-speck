"use server";
import { Column } from "@/types/model";
import { getColumns as queryColumns } from "../repositories/column-repository";
import { assertAccess } from "./authZ-action";

export async function getColumns(retroId: number): Promise<Column[]> {
  await assertAccess(retroId);
  return await queryColumns(retroId);
}
