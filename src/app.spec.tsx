import { App } from "@/app";
import { render, screen } from "@testing-library/react";

it("Test", () => {
  render(<App />);
  expect(1).toBe(1);
});
