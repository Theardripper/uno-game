import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Badge, badgeVariants } from "./badge";

describe("Componente Badge", () => {
  it("deve renderizar o badge com o conteúdo e a tag 'span' padrão", () => {
    render(<Badge>Novo</Badge>);

    const badge = screen.getByText("Novo");
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
  });

  it("deve aplicar as classes da variante padrão (default)", () => {
    render(<Badge>Default</Badge>);

    const badge = screen.getByText("Default");
    expect(badge).toHaveClass(
      "bg-auth-accent",
      "text-auth-accent-foreground",
      "uppercase"
    );
  });

  it("deve aplicar as classes corretas quando uma variante personalizada é informada", () => {
    render(<Badge variant="destructive">Alerta</Badge>);

    const badge = screen.getByText("Alerta");
    expect(badge).toHaveClass("bg-destructive/10", "text-destructive");
  });

  it("deve mesclar classes personalizadas passadas via prop className", () => {
    render(<Badge className="custom-badge shadow-md">Tag Extra</Badge>);

    const badge = screen.getByText("Tag Extra");
    expect(badge).toHaveClass("custom-badge", "shadow-md");
  });

  it("deve renderizar como um elemento customizado usando a prop 'render'", () => {
    render(
      <Badge
        variant="outline"
        render={(props) => <a href="/details" {...props} />}
      >
        Link Badge
      </Badge>
    );

    const badge = screen.getByRole("link", { name: /link badge/i });
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("href", "/details");
    expect(badge).toHaveClass("border-border", "text-foreground");
  });

  it("deve repassar a ref para o elemento DOM correspondente", () => {
    const ref = createRef();
    render(<Badge ref={ref}>Com Ref</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("Helper badgeVariants", () => {
  it("deve retornar as classes padrão ao ser invocado sem argumentos", () => {
    const classes = badgeVariants();
    expect(classes).toContain("bg-auth-accent");
    expect(classes).toContain("uppercase");
  });

  it("deve retornar as classes específicas para variantes conhecidas", () => {
    const classes = badgeVariants({ variant: "ghost" });
    expect(classes).toContain("hover:bg-muted");
  });
});