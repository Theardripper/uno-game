import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { Label } from "./label";

describe("Componente Label", () => {
  it("deve renderizar o elemento label com o texto correto", () => {
    render(<Label>Nome do Usuário</Label>);

    const label = screen.getByText("Nome do Usuário");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("deve aplicar as classes padrão de estilização", () => {
    render(<Label>Rótulo</Label>);

    const label = screen.getByText("Rótulo");
    expect(label).toHaveClass(
      "text-sm",
      "font-medium",
      "leading-none",
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-70"
    );
  });

  it("deve mesclar classes personalizadas passadas via prop className", () => {
    render(<Label className="text-red-500 custom-label">Campo Obrigatório</Label>);

    const label = screen.getByText("Campo Obrigatório");
    expect(label).toHaveClass("text-red-500", "custom-label", "text-sm");
  });

  it("deve vincular corretamente com um campo de entrada usando o atributo htmlFor", () => {
    render(
      <>
        <Label htmlFor="email-input">E-mail</Label>
        <input id="email-input" type="email" />
      </>
    );

    const label = screen.getByText("E-mail");
    const input = screen.getByRole("textbox", { name: "E-mail" });

    expect(label).toHaveAttribute("for", "email-input");
    expect(input).toBeInTheDocument();
  });

  it("deve encaminhar a ref corretamente para o elemento HTMLLabelElement", () => {
    const ref = createRef();
    render(<Label ref={ref}>Label com Ref</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});