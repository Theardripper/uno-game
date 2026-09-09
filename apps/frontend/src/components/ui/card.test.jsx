import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Componente Card e Subcomponentes", () => {
  describe("Card (Root)", () => {
    it("deve renderizar o container do card com os atributos e tamanho padrão", () => {
      render(<Card data-testid="card-root">Conteúdo</Card>);

      const card = screen.getByTestId("card-root");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card).toHaveAttribute("data-size", "default");
      expect(card).toHaveClass("bg-card", "rounded-xl");
    });

    it("deve aplicar o tamanho 'sm' através da prop size", () => {
      render(
        <Card size="sm" data-testid="card-root">
          Pequeno
        </Card>
      );

      const card = screen.getByTestId("card-root");
      expect(card).toHaveAttribute("data-size", "sm");
    });

    it("deve mesclar classes personalizadas passadas via className", () => {
      render(
        <Card className="custom-card shadow-lg" data-testid="card-root">
          Conteúdo
        </Card>
      );

      const card = screen.getByTestId("card-root");
      expect(card).toHaveClass("custom-card", "shadow-lg");
    });
  });

  describe("Subcomponentes do Card", () => {
    it("deve renderizar a estrutura completa do Card com todos os subcomponentes", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título do Card</CardTitle>
            <CardDescription>Descrição do Card</CardDescription>
            <CardAction>
              <button>Ação</button>
            </CardAction>
          </CardHeader>
          <CardContent>Conteúdo Principal</CardContent>
          <CardFooter>Rodapé</CardFooter>
        </Card>
      );

      expect(screen.getByText("Título do Card")).toHaveAttribute(
        "data-slot",
        "card-title"
      );
      expect(screen.getByText("Descrição do Card")).toHaveAttribute(
        "data-slot",
        "card-description"
      );
      expect(screen.getByRole("button", { name: "Ação" })).toBeInTheDocument();
      expect(screen.getByText("Conteúdo Principal")).toHaveAttribute(
        "data-slot",
        "card-content"
      );
      expect(screen.getByText("Rodapé")).toHaveAttribute(
        "data-slot",
        "card-footer"
      );
    });

    it("deve aplicar as classes corretas no CardHeader, CardContent e CardFooter", () => {
      render(
        <Card>
          <CardHeader data-testid="header">Header</CardHeader>
          <CardContent data-testid="content">Content</CardContent>
          <CardFooter data-testid="footer">Footer</CardFooter>
        </Card>
      );

      expect(screen.getByTestId("header")).toHaveClass("group/card-header");
      expect(screen.getByTestId("content")).toHaveClass("px-(--card-spacing)");
      expect(screen.getByTestId("footer")).toHaveClass("bg-muted/50", "border-t");
    });

    it("deve renderizar o CardAction com o data-slot e posicionamento correto", () => {
      render(<CardAction data-testid="action">Ação</CardAction>);

      const action = screen.getByTestId("action");
      expect(action).toHaveAttribute("data-slot", "card-action");
      expect(action).toHaveClass("col-start-2", "row-span-2");
    });
  });

  describe("Encaminhamento de Refs", () => {
    it("deve repassar a ref para o elemento DOM do Card", () => {
      const ref = createRef();
      render(<Card ref={ref}>Com Ref</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});