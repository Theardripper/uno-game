import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";

import {
  createToastManager,
  ToastIcon,
  Toaster,
} from "./toast";

describe("Componente Toaster e Sistema de Toast", () => {
  it("deve renderizar a notificação disparada pelo toastManager", async () => {
    const customManager = createToastManager();

    render(<Toaster toastManager={customManager} />);

    act(() => {
      customManager.add({
        title: "Sucesso!",
        description: "Operação realizada com êxito.",
        type: "success",
      });
    });

    expect(screen.getByText("Sucesso!")).toBeInTheDocument();
    expect(screen.getByText("Operação realizada com êxito.")).toBeInTheDocument();
  });

  it("deve fechar a notificação ao clicar no botão de fechar", async () => {
    const user = userEvent.setup();
    const customManager = createToastManager();

    render(<Toaster toastManager={customManager} />);

    act(() => {
      customManager.add({
        title: "Toast Fechável",
      });
    });

    expect(screen.getByText("Toast Fechável")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close toast/i });
    await user.click(closeButton);

    expect(screen.queryByText("Toast Fechável")).not.toBeInTheDocument();
  });

  it("deve renderizar os ícones corretos de acordo com a propriedade 'type'", () => {
    const { rerender } = render(<ToastIcon type="success" />);
    expect(document.querySelector("[data-slot='toast-icon']")).toBeInTheDocument();

    rerender(<ToastIcon type="error" />);
    expect(document.querySelector(".text-destructive")).toBeInTheDocument();

    rerender(<ToastIcon type="loading" />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();

    rerender(<ToastIcon type="unknown" />);
    expect(document.querySelector("[data-slot='toast-icon']")).not.toBeInTheDocument();
  });

  it("deve aplicar atributos de acessibilidade e slots estruturais", () => {
    const customManager = createToastManager();

    render(<Toaster toastManager={customManager} />);

    act(() => {
      customManager.add({
        title: "Acessibilidade",
      });
    });

    const viewport = document.querySelector("[data-slot='toast-viewport']");
    const content = document.querySelector("[data-slot='toast-content']");

    expect(viewport).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});