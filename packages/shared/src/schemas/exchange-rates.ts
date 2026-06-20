import { z } from "zod";
import { normalizeExchangeRateProvider } from "../runtime";

/**
 * 汇率 provider 枚举。
 *
 * settings 里只保存 provider key；具体外部 API 响应由前端 service 层转换成统一 USD 基准数据。
 */
export const exchangeRateProviderSchema = z.enum(["exchange-api", "floatrates"]);

export { normalizeExchangeRateProvider };

/** 统一汇率表以 USD 为基准，key 固定为 ISO 4217 三字母大写代码。 */
export const exchangeRatesSchema = z.record(
  z.string().regex(/^[A-Z]{3}$/),
  z.number().finite().positive(),
);

/** currency-api.pages.dev 的 USD 响应允许额外字段；只提取 date 和 usd 汇率表。 */
export const exchangeApiUsdResponseSchema = z.object({
  date: z.string().min(1),
  usd: z.record(z.string(), z.number().finite().positive()),
}).passthrough();

/** FloatRates 响应按小写货币代码分桶，进入缓存前会转换为统一大写代码表。 */
export const floatRatesRateRowSchema = z.object({
  alphaCode: z.string().regex(/^[A-Z]{3}$/),
  rate: z.number().finite().positive(),
  date: z.string().min(1),
}).passthrough();

export const floatRatesResponseSchema = z.record(
  z.string().regex(/^[a-z]{3}$/),
  floatRatesRateRowSchema,
);

export const exchangeRateDataSchema = z.object({
  base: z.literal("USD"),
  date: z.string().min(1),
  rates: exchangeRatesSchema,
}).strict();

/** 缓存同时记录请求 provider 和实际 provider，方便降级时解释数据来源。 */
export const cachedExchangeRateDataSchema = exchangeRateDataSchema.extend({
  cachedAt: z.number().finite(),
  requestedProvider: exchangeRateProviderSchema,
  provider: exchangeRateProviderSchema,
}).strict();

export type ExchangeRateProvider = z.infer<typeof exchangeRateProviderSchema>;
export type ExchangeRates = z.infer<typeof exchangeRatesSchema>;
export type ExchangeRateData = z.infer<typeof exchangeRateDataSchema>;
export type CachedExchangeRateData = z.infer<typeof cachedExchangeRateDataSchema>;
