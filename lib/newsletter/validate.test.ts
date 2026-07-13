import { describe, expect, it } from "vitest";
import { isValidEmail } from "./validate";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects an address missing @", () => {
    expect(isValidEmail("ab.co")).toBe(false);
  });

  it("rejects an address with a space before the @", () => {
    expect(isValidEmail("a b@c.co")).toBe(false);
  });

  it("rejects an address with a space after the @", () => {
    expect(isValidEmail("a@b .co")).toBe(false);
  });

  it("rejects an address longer than 254 characters", () => {
    const longLocal = "a".repeat(250);
    expect(isValidEmail(`${longLocal}@b.co`)).toBe(false);
  });
});
