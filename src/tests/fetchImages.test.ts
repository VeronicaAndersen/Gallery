import { fetchImages } from "../utils/fetchImages";

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("FetchImages util", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns image results when API call succeeds", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            id: "1",
            alt_description: "Test image",
            urls: { regular: "https://example.com/test.jpg" },
            user: { name: "Alice", username: "alice123" },
            links: { download: "https://example.com/download" },
          },
        ],
      }),
    });

    const images = await fetchImages("Disney", 1);

    expect(images).toHaveLength(1);
    expect(images[0].user.name).toBe("Alice");
    expect(images[0].urls.regular).toBe("https://example.com/test.jpg");
  });

  it("throws error when API responds with !ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(fetchImages("Disney", 1)).rejects.toThrow(
      "Network response was not ok"
    );
  });

  it("throws error if API_URL is missing", async () => {
    // Temporarily clear API_URL
    const oldEnv = process.env.REACT_APP_API_URL;
    (process.env.REACT_APP_API_URL as any) = undefined;

    await expect(fetchImages("Disney", 1)).rejects.toThrow("API_URL is not defined");

    // Restore env
    process.env.REACT_APP_API_URL = oldEnv;
  });
});
