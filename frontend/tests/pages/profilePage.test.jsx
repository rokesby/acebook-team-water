import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { ProfilePage } from "../../src/pages/ProfilePage/ProfilePage";
import { getUserPosts } from "../../src/services/posts";
import { act } from "react-dom/test-utils";

// Mock the posts service
vi.mock("../../src/services/posts", () => ({
    getUserPosts: vi.fn(),
}));

// Mock the navigation
const navigateMock = vi.fn();
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

// Mock the Post component
vi.mock("../../components/Post/Post", () => ({
    default: ({ post }) => (
        <div data-testid="post" className="d-flex justify-content-center">
            <div className="toast">
                <div className="toast-header">
                    <img src={post.user_id.profileImage} alt="Profile" className="rounded me-2 profile-image" />
                    <strong className="me-auto">{post.user_id.name}</strong>
                    <button data-testid="like-button">
                        <span data-testid="like-count">{post.numberOfLikes}</span>
                    </button>
                </div>
                <div className="toast-body">
                    <article>{post.message}</article>
                    {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{ width: '80%' }} />}
                </div>
            </div>
        </div>
    ),
}));

describe("Profile Page", () => {
    const mockPosts = [
        {
            _id: "12345",
            message: "Test User Post",
            user_id: { _id: "userId", name: "Test User", email: "test@example.com", profileImage: "testProfileImage.jpg" },
            imageUrl: "testImage.jpg",
            comments: [],
            numberOfLikes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify({ name: "Test User", profileImage: "testProfileImage.jpg" }));
        vi.clearAllMocks();
    });

    test("It displays user posts from the backend", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockResolvedValue(mockPosts);
    
        await act(async () => {
            render(<ProfilePage />);
        });
    
        await waitFor(() => {
            const post = screen.getByTestId("post");
            expect(post).toBeInTheDocument();
            
            const userName = within(post).getByText("Test User");
            expect(userName).toBeInTheDocument();
            
            const postContent = within(post).getByText("Test User Post");
            expect(postContent).toBeInTheDocument();
            
            const profileImage = within(post).getByAltText("Profile");
            expect(profileImage).toHaveAttribute('src', 'testProfileImage.jpg');
            
            const postImage = within(post).getByAltText("Post");
            expect(postImage).toHaveAttribute('src', 'testImage.jpg');
        });
    });

    test("It displays a message when there are no posts", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockResolvedValue([]);

        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            const message = screen.getByText("No posts to display");
            expect(message).toBeInTheDocument();
        });
    });

    test("It navigates to login if no token is present", async () => {
        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith("/login");
        });
    });

    test("It displays an error message when getUserPosts fails", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockRejectedValue(new Error("Failed to fetch posts"));

        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            const errorMessage = screen.getByText("error:Failed to fetch posts");
            expect(errorMessage).toBeInTheDocument();
        });
    });
});