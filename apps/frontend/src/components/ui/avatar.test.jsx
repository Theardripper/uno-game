import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

import { vi } from "vitest";

vi.mock("@base-ui/react/avatar", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Avatar: {
      ...actual.Avatar,
      Image: function MockImage({ src, alt, ...props }) {
        return <img src={src} alt={alt} {...props} />;
      },
    },
  };
});

describe("Componente Avatar e Subcomponentes", () => {
  describe("Avatar (Root)", () => {
    it("deve renderizar o avatar com atributos e tamanho padrão", () => {
      render(<Avatar data-testid="avatar-root">Avatar</Avatar>);

      const avatar = screen.getByTestId("avatar-root");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("data-slot", "avatar");
      expect(avatar).toHaveAttribute("data-size", "default");
      expect(avatar).toHaveClass("size-8");
    });

    it("deve aplicar as classes corretas para tamanhos personalizados", () => {
      const { rerender } = render(
        <Avatar size="sm" data-testid="avatar-root">
          Avatar
        </Avatar>
      );
      let avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveAttribute("data-size", "sm");

      rerender(
        <Avatar size="lg" data-testid="avatar-root">
          Avatar
        </Avatar>
      );
      avatar = screen.getByTestId("avatar-root");
      expect(avatar).toHaveAttribute("data-size", "lg");
    });

    it("deve mesclar classes personalizadas via className", () => {
      render(
        <Avatar className="custom-avatar-class" data-testid="avatar-root">
          Avatar
        </Avatar>
      );
      expect(screen.getByTestId("avatar-root")).toHaveClass(
        "custom-avatar-class"
      );
    });
  });

  describe("AvatarImage", () => {
    it("deve renderizar a imagem com o atributo data-slot correto e src", () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.png" alt="User Avatar" />
        </Avatar>
      );

      const image = screen.getByRole("img", { name: /user avatar/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("data-slot", "avatar-image");
      expect(image).toHaveAttribute("src", "https://example.com/avatar.png");
    });
  });

  describe("AvatarFallback", () => {
    it("deve renderizar o fallback com o conteúdo e data-slot corretos", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText("JD");
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveAttribute("data-slot", "avatar-fallback");
      expect(fallback).toHaveClass("bg-muted", "rounded-full");
    });
  });

  describe("AvatarBadge", () => {
    it("deve renderizar o elemento de badge indicador de status", () => {
      render(
        <Avatar>
          <AvatarBadge data-testid="avatar-badge" />
        </Avatar>
      );

      const badge = screen.getByTestId("avatar-badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "avatar-badge");
      expect(badge).toHaveClass("absolute", "right-0", "bottom-0");
    });
  });

  describe("AvatarGroup e AvatarGroupCount", () => {
    it("deve renderizar o agrupador de avatares com data-slot correto", () => {
      render(
        <AvatarGroup data-testid="avatar-group">
          <Avatar>User 1</Avatar>
          <Avatar>User 2</Avatar>
        </AvatarGroup>
      );

      const group = screen.getByTestId("avatar-group");
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute("data-slot", "avatar-group");
      expect(group).toHaveClass("-space-x-2");
    });

    it("deve renderizar o contador do grupo com o valor numérico", () => {
      render(
        <AvatarGroup>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      );

      const count = screen.getByText("+3");
      expect(count).toBeInTheDocument();
      expect(count).toHaveAttribute("data-slot", "avatar-group-count");
    });
  });

  describe("Encaminhamento de Refs", () => {
    it("deve repassar a ref para o elemento do DOM no Avatar", () => {
      const ref = createRef();
      render(<Avatar ref={ref}>Ref Avatar</Avatar>);

      expect(ref.current).not.toBeNull();
    });
  });
});