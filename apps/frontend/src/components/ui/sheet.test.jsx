import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

describe("Componente Sheet e Subcomponentes", () => {
  it("deve abrir e fechar a gaveta (sheet) interativamente", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir Painel</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Título da Gaveta</SheetTitle>
            <SheetDescription>Descrição da Gaveta</SheetDescription>
          </SheetHeader>
          <p>Conteúdo da Gaveta</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByText("Título da Gaveta")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: /abrir painel/i });
    await user.click(trigger);

    expect(screen.getByText("Título da Gaveta")).toBeInTheDocument();
    expect(screen.getByText("Descrição da Gaveta")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo da Gaveta")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(screen.queryByText("Título da Gaveta")).not.toBeInTheDocument();
  });

  it("deve aplicar o lado correto (data-side) no SheetContent", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir Esquerda</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>Painel Esquerdo</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /abrir esquerda/i }));

    const popup = screen
      .getByText("Painel Esquerdo")
      .closest("[data-slot='sheet-content']");
    expect(popup).toHaveAttribute("data-side", "left");
  });

  it("não deve renderizar o botão de fechar quando showCloseButton for false", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir Sem Botão</SheetTrigger>
        <SheetContent showCloseButton={false}>
          <SheetTitle>Painel Sem Fechar</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /abrir sem botão/i }));

    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
  });

  it("deve aplicar o atributo data-slot correto em todos os subcomponentes", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent>
          <SheetHeader data-testid="header">
            <SheetTitle>Título</SheetTitle>
            <SheetDescription>Descrição</SheetDescription>
          </SheetHeader>
          <SheetFooter data-testid="footer">Rodapé</SheetFooter>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "sheet-header");
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "sheet-footer");
    expect(screen.getByText("Título")).toHaveAttribute("data-slot", "sheet-title");
    expect(screen.getByText("Descrição")).toHaveAttribute("data-slot", "sheet-description");
  });

  it("deve mesclar classes personalizadas via prop className no SheetContent", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>Abrir</SheetTrigger>
        <SheetContent className="custom-sheet-class">
          <SheetTitle>Gaveta Customizada</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    const popup = screen
      .getByText("Gaveta Customizada")
      .closest("[data-slot='sheet-content']");
    expect(popup).toHaveClass("custom-sheet-class");
  });
});