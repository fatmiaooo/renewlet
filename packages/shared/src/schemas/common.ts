import { z } from "zod";

/**
 * 无额外业务数据的成功响应。
 *
 * 需要携带状态机结果时应新增专用 schema，避免把公共 ok 契约扩成含糊响应桶。
 */
export const okResponseSchema = z.object({
  ok: z.literal(true),
}).strict();

export type OkResponse = z.infer<typeof okResponseSchema>;
