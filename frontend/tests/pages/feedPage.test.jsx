import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token"); // Clears localStorage to ensure each test starts with a clean slate
  });

  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken"); // Sets a token in localStorage to simulate a user being logged in

    const mockPosts = [{ _id: "12345", message: "Test Post 1" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    const post = await screen.findByRole("article");
    expect(post.textContent).toEqual("Test Post 1");
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("It displays posts from the backend in the correct order", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockPosts = [
      { _id: "1", message: "Test Post 1", createdAt: "2024-07-20T10:15:00Z" },
      { _id: "2", message: "Test Post 2", createdAt: "2024-08-05T14:35:00Z" },
      { _id: "3", message: "Test Post 3", createdAt: "2024-06-30T08:45:00Z" }
    ];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    render(<FeedPage />);

    const posts = await screen.findByRole("article");
    expect(posts[0].textContent).toEqual("Test Post 1");
    expect(posts[1].textContent).toEqual("Test Post 2");
    expect(posts[2].textContent).toEqual("Test Post 3");
  });
  
});
