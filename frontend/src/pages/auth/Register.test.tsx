import { cleanup, fireEvent, render } from "@testing-library/react";
import { Register } from ".";
import { BrowserRouter } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import { AxiosError } from "axios";

vi.mock("../../components", () => {
  return {
    Navbar: () => {
      <>Navbar</>;
    },
  };
});
vi.mock("../../hooks");
vi.mock("react-router-dom", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const original: any = await importOriginal();
  return {
    ...original,
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
  };
});

const mockAuthRegister = async ({ reject } = { reject: false }) => {
  const mockMethod = vi.spyOn(AuthService.prototype, "register");
  if (reject) mockMethod.mockRejectedValue(new AxiosError("Upps"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else mockMethod.mockResolvedValue({} as any);
  return mockMethod;
};

describe("Register page", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should be render", async () => {
    await mockAuthRegister();
    const component = render(<Register />, { wrapper: BrowserRouter });

    component.getByRole("textbox");
    component.getByLabelText("Contraseña");
    component.getByRole("button");
  });

  it("should handle error fields", async () => {
    await mockAuthRegister();
    const component = render(<Register />, { wrapper: BrowserRouter });

    const submitButton = component.getByRole("button");
    const usernameField = component.getByRole("textbox");
    const passwordField = component.getByLabelText("Contraseña");

    fireEvent.click(submitButton);

    // Invalid fields
    expect(usernameField.getAttribute("aria-invalid")).toBe("true");
    expect(passwordField.getAttribute("aria-invalid")).toBe("true");

    // Password invalid field
    fireEvent.change(usernameField, { target: { value: "username" } });
    fireEvent.change(passwordField, { target: { value: "" } });
    fireEvent.click(submitButton);

    expect(usernameField.getAttribute("aria-invalid")).toBe("false");
    expect(passwordField.getAttribute("aria-invalid")).toBe("true");

    // Username invalid field
    fireEvent.change(usernameField, { target: { value: "" } });
    fireEvent.change(passwordField, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(usernameField.getAttribute("aria-invalid")).toBe("true");
    expect(passwordField.getAttribute("aria-invalid")).toBe("false");

    // No invalid fields
    fireEvent.change(usernameField, { target: { value: "username" } });
    fireEvent.change(passwordField, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(usernameField.getAttribute("aria-invalid")).toBe("false");
    expect(passwordField.getAttribute("aria-invalid")).toBe("false");
  });

  it("should login", async () => {
    const mockRegister = await mockAuthRegister();

    const component = render(<Register />, { wrapper: BrowserRouter });

    const submitButton = component.getByRole("button");
    const usernameField = component.getByRole("textbox");
    const passwordField = component.getByLabelText("Contraseña");

    fireEvent.change(usernameField, { target: { value: "myusername" } });
    fireEvent.change(passwordField, { target: { value: "mypassword" } });

    fireEvent.click(submitButton);
    expect(mockRegister.mock.calls.length).toBe(1);
  });
});
