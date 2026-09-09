import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

describe("Componente Dialog e Subcomponentes", () => {
  it("deve abrir e fechar o modal interativamente", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Abrir Modal</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título do Modal</DialogTitle>
            <DialogDescription>Descrição do Modal</DialogDescription>
          </DialogHeader>
          <p>Conteúdo interno</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Título do Modal")).not.toBeInTheDocument();

    const trigger = screen.getByRole("button", { name: /abrir modal/i });
    await user.click(trigger);

    expect(screen.getByText("Título do Modal")).toBeInTheDocument();
    expect(screen.getByText("Descrição do Modal")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo interno")).toBeInTheDocument();

    const closeButton = screen.getAllByRole("button", { name: /close/i })[0];
    await user.click(closeButton);

    expect(screen.queryByText("Título do Modal")).not.toBeInTheDocument();
  });

  it("não deve renderizar o botão 'X' de fechar quando showCloseButton for false no DialogContent", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Modal sem fechar</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    expect(screen.queryAllByRole("button", { name: /close/i })).toHaveLength(0);
  });

  it("deve renderizar o botão de fechar no DialogFooter quando showCloseButton for true", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogTitle>Modal com Footer</DialogTitle>
          <DialogFooter showCloseButton={true}>
            <button>Salvar</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    const footerCloseButton = screen.getAllByRole("button", { name: /^close$/i })[0];
    expect(footerCloseButton).toBeInTheDocument();

    await user.click(footerCloseButton);
    expect(screen.queryByText("Modal com Footer")).not.toBeInTheDocument();
  });

  it("deve aplicar o atributo data-slot correto em cada subcomponente", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent>
          <DialogHeader data-testid="header">
            <DialogTitle>Título</DialogTitle>
            <DialogDescription>Descrição</DialogDescription>
          </DialogHeader>
          <DialogFooter data-testid="footer">Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "dialog-header");
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "dialog-footer");
    expect(screen.getByText("Título")).toHaveAttribute("data-slot", "dialog-title");
    expect(screen.getByText("Descrição")).toHaveAttribute("data-slot", "dialog-description");
  });

  it("deve mesclar classes personalizadas via prop className no DialogContent e Overlay", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Abrir</DialogTrigger>
        <DialogContent className="custom-dialog-class">
          <DialogTitle>Título Customizado</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /abrir/i }));

    const popup = screen.getByText("Título Customizado").closest("[data-slot='dialog-content']");
    expect(popup).toHaveClass("custom-dialog-class");
  });
});