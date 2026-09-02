import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Skeleton } from "./skeleton";

describe("Componente Skeleton", () => {
  it("deve renderizar o elemento skeleton corretamente", () => {
    render(<Skeleton data-testid="skeleton-element" />);

    const skeleton = screen.getByTestId("skeleton-element");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
  });

  it("deve aplicar as classes padrão de animação e estilo base", () => {
    render(<Skeleton data-testid="skeleton-element" />);

    const skeleton = screen.getByTestId("skeleton-element");
    expect(skeleton).toHaveClass("animate-pulse", "rounded-md", "bg-muted");
  });

  it("deve mesclar classes de tamanho e estilo personalizadas via className", () => {
    render(
      <Skeleton
        className="h-12 w-12 rounded-full"
        data-testid="skeleton-element"
      />
    );

    const skeleton = screen.getByTestId("skeleton-element");
    expect(skeleton).toHaveClass(
      "h-12",
      "w-12",
      "rounded-full",
      "animate-pulse",
      "bg-muted"
    );
  });

  it("deve repassar atributos HTML adicionais para o container", () => {
    render(
      <Skeleton
        aria-label="Carregando dados"
        role="status"
        data-testid="skeleton-element"
      />
    );

    const skeleton = screen.getByTestId("skeleton-element");
    expect(skeleton).toHaveAttribute("aria-label", "Carregando dados");
    expect(skeleton).toHaveAttribute("role", "status");
  });

  it("deve repassar a ref para o elemento HTMLDivElement do DOM", () => {
    const ref = createRef();
    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});