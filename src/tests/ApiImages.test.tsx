import { render, screen, waitFor } from "@testing-library/react";
import ApiImages from "../components/ApiImages";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("ApiImages component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays images from API", async () => {
    // Mock API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            id: "1",
            alt_description: "Test image",
            urls: { regular: "https://example.com/test.jpg" },
            user: { name: "John Doe", username: "johndoe" },
            links: { download: "https://example.com/download" },
          },
        ],
      }),
    });

    render(<ApiImages category="Disney" page={1} setPage={jest.fn()} />);

    // Loader should appear first
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Wait until the mocked image appears
    await waitFor(() =>
      expect(screen.getByAltText("Test image")).toBeInTheDocument()
    );

    // Check if username is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();

    // Check if download link is present
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/download"
    );
  });

  it("shows error if API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<ApiImages category="ErrorTest" page={1} setPage={jest.fn()} />);

    await waitFor(() =>
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    );
  });
});
