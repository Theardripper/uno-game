import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

import { Input } from "./input";

describe("Componente Input", () => {
  it("deve renderizar o campo de entrada corretamente", () => {
    render(<Input placeholder="Digite seu e-mail" />);

    const input = screen.getByPlaceholderText("Digite seu e-mail");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("deve atribuir o tipo correto via prop 'type'", () => {
    render(<Input type="password" placeholder="Senha" />);

    const input = screen.getByPlaceholderText("Senha");
    expect(input).toHaveAttribute("type", "password");
  });

  it("deve permitir a digitação de texto pelo usuário", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Nome" />);

    const input = screen.getByPlaceholderText("Nome");
    await user.type(input, "João Silva");

    expect(input).toHaveValue("João Silva");
  });

  it("deve disparar a função onChange ao alterar o valor", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} placeholder="Buscar" />);

    const input = screen.getByPlaceholderText("Buscar");
    await user.type(input, "a");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("deve aplicar o estado desabilitado e impedir digitação", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input disabled onChange={handleChange} placeholder="Bloqueado" />);

    const input = screen.getByPlaceholderText("Bloqueado");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");

    await user.type(input, "teste");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("deve mesclar classes personalizadas via className", () => {
    render(<Input className="custom-input-class" placeholder="Custom" />);

    const input = screen.getByPlaceholderText("Custom");
    expect(input).toHaveClass("custom-input-class", "bg-auth-input");
  });

  it("deve repassar a ref para o elemento DOM do input", () => {
    const ref = createRef();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});