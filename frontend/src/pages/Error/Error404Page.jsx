export const Error404Page = () => {
    return (
        <div className='container text-center mt-5'>
            <h1>404 - Page Not Found</h1>
            <p>
                The page you are looking for does not exist or has been moved.
            </p>
            <a href='/' className='btn btn-primary'>
                Go to Home
            </a>
        </div>
    );
};
