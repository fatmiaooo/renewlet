/**
 * 路由兼容适配层（React Router）。
 *
 * 架构位置：部分组件保留了 Next.js 风格的 `useRouter/usePathname` 心智模型；
 * 这里把它收敛为薄 shim，避免页面层直接依赖多个路由 API。
 *
 * 注意： `back()` 使用浏览器 history，不会自动套用登录 next 路径清洗。
 */
import {
  useLocation,
  useNavigate,
  useSearchParams as useReactRouterSearchParams,
} from "react-router-dom";

export function usePathname(): string {
  return useLocation().pathname;
}

/** 返回 React Router 当前 search params 的快照；调用方不要缓存后再跨导航复用，避免 next 参数清洗读到旧值。 */
export function useSearchParams(): URLSearchParams {
  const [params] = useReactRouterSearchParams();
  return params;
}

/** 提供项目内统一使用的命令式导航接口；保留 Next 风格方法名是为了让共享组件迁移到 React Router 后不分叉。 */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => window.history.back(),
  };
}
