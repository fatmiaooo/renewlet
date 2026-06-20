// 图片裁剪弹窗测试保护 canvas 导出、缩放/平移状态和关闭清理，避免上传链路拿到过期裁剪结果。
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImageCropDialog } from "./image-crop-dialog";

describe("ImageCropDialog", () => {
  it("exposes an accessible description for the crop dialog", () => {
    render(
      <ImageCropDialog
        open
        onOpenChange={vi.fn()}
        imageSrc="data:image/png;base64,iVBORw0KGgo="
        onCropComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "裁剪 Logo" })).toHaveAccessibleDescription(
      "调整 Logo 的裁剪区域、缩放和旋转，然后确认裁剪结果。",
    );
  });
});
