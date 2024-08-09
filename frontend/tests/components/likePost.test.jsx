import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, expect, test, beforeEach, describe } from "vitest";
import { act } from "react-dom/test-utils";
import Post from "../../src/components/Post/Post";
import { likePost } from "../../src/services/posts";
import "@testing-library/jest-dom";

// Mock the posts service
vi.mock("../../src/services/posts", () => ({
    likePost: vi.fn(),
}));

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
        useLocation: () => ({
            pathname: "/",
        }),
    };
});

describe("Post Component Like Functionality", () => {
    const mockPost = {
        _id: "123",
        message: "Test post",
        user_id: { name: "Test User", profileImage: "testProfileImage.jpg" },
        createdAt: new Date().toISOString(),
        numberOfLikes: 0,
        isLikedByUser: false,
        comments: [],
        likes: [],
        imageUrl: "testImage.jpg",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem("token", "fake-token");
        likePost.mockResolvedValue({ numberOfLikes: 1 });
    });

    test("renders the post with like button and initial like count", async () => {
        await act(async () => {
            render(<Post post={mockPost} />);
        });

        expect(screen.getByText("Test post")).toBeInTheDocument();
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByAltText("Profile")).toHaveAttribute("src", "testProfileImage.jpg");
        expect(screen.getByAltText("Post")).toHaveAttribute("src", "testImage.jpg");
        expect(screen.getByTestId("like-button")).toBeInTheDocument();
        expect(screen.getByTestId("like-count")).toHaveTextContent("0");
    });

    test("updates like status and count when like button is clicked", async () => {
        await act(async () => {
            render(<Post post={mockPost} />);
        });

        const likeButton = screen.getByTestId("like-button");

        await act(async () => {
            fireEvent.click(likeButton);
        });

        await waitFor(() => {
            expect(screen.getByTestId("like-count")).toHaveTextContent("1");
        });

        expect(likePost).toHaveBeenCalledWith("fake-token", "123");
    });

    test("handles error when liking a post fails", async () => {
        const consoleSpy = vi.spyOn(console, 'error');
        likePost.mockRejectedValue(new Error("Failed to like post"));
    
        await act(async () => {
            render(<Post post={mockPost} />);
        });
    
        const likeButton = screen.getByTestId("like-button");
    
        await act(async () => {
            fireEvent.click(likeButton);
        });
    
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
        });
    
        expect(screen.getByTestId("like-count")).toHaveTextContent("0");
    });

    test("renders filled heart icon when post is liked by user", async () => {
        const likedPost = {
            ...mockPost,
            isLikedByUser: true,
            numberOfLikes: 1,
        };
        
        await act(async () => {
            render(<Post post={likedPost} />);
        });

        expect(screen.getByTestId("like-count")).toHaveTextContent("1");
        expect(screen.getByTestId("like-button")).toBeInTheDocument();
        expect(screen.getByTestId("filled-heart-icon")).toBeInTheDocument();
    });

    test("renders edit and delete buttons on profile page", async () => {
        vi.mock("react-router-dom", async () => {
            const actual = await vi.importActual("react-router-dom");
            return {
                ...actual,
                useNavigate: () => navigateMock,
                useLocation: () => ({
                    pathname: "/profile",
                }),
            };
        });

        await act(async () => {
            render(<Post post={mockPost} />);
        });

        expect(screen.getByRole("button", { name: /Edit Post/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Delete Post/i })).toBeInTheDocument();
    });

    test("renders like accordion with correct information", async () => {
        const postWithLikes = {
            ...mockPost,
            numberOfLikes: 2,
            likes: [
                { _id: "user1", name: "User One", profileImage: "profile1.jpg" },
                { _id: "user2", name: "User Two", profileImage: "profile2.jpg" },
            ],
        };

        await act(async () => {
            render(<Post post={postWithLikes} />);
        });

        // Check if the accordion header is present with the correct number of likes
        const accordionHeader = screen.getByText(/Likes: 2/i);
        expect(accordionHeader).toBeInTheDocument();

        // Click the accordion to expand it
        fireEvent.click(accordionHeader);

        // Check if both users who liked the post are displayed
        await waitFor(() => {
            expect(screen.getByText("User One")).toBeInTheDocument();
            expect(screen.getByText("User Two")).toBeInTheDocument();
        });

        // Check if profile images are rendered
        const profileImages = screen.getAllByAltText("Profile");
        expect(profileImages).toHaveLength(3); // 1 for post author, 2 for likers
        expect(profileImages[1]).toHaveAttribute("src", "profile1.jpg");
        expect(profileImages[2]).toHaveAttribute("src", "profile2.jpg");
    });

    test("renders like accordion with no likes message", async () => {
        await act(async () => {
            render(<Post post={mockPost} />);
        });

        // Check if the accordion header is present with zero likes
        const accordionHeader = screen.getByText(/Likes: 0/i);
        expect(accordionHeader).toBeInTheDocument();

        // Click the accordion to expand it
        fireEvent.click(accordionHeader);

        // Check if the "No likes yet" message is displayed
        await waitFor(() => {
            expect(screen.getByText("No likes yet. Be the first to like!")).toBeInTheDocument();
        });
    });
});