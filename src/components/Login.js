function Login(){
    return(
        <div className="leftscreen">
            <h1>Sign in</h1>
            <p>Welcome back!</p>
            <form>
                <div>
                    <label>
                        Email
                    </label>
                    <input
                        className="email"
                        type="email"
                    />
                </div>
                <div>
                    <label>
                        Password
                    </label>
                    <input
                        className="password"
                        type="password"
                    />
                </div>
                <button
                className="button"
                type="submit"
                >
                    Sign in
                </button>
            </form>
            <div>
                <p>
                    Don't have an account?
                </p>
            </div>
        </div>
    );
}

export default Login;