export interface UserData {
    username: string;
    password: string;
    confirmedPassword?: string;
}

export const validateUserInput = (userData: UserData): string | null => {
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]{1,22}[a-zA-Z0-9]$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-])[a-zA-Z0-9!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-]{8,32}$/;

    if (!usernameRegex.test(userData.username)) {
        return "Username must be 3-30 characters long and can only contain letters, numbers, and underscores.";
    }
    if (!passwordRegex.test(userData.password)) {
        return "Password must have atleast 1 UPPERCASE, 1 lowercase, 1 digit, and 1 special character with length between 8-32.";
    }
    if (userData.confirmedPassword && userData.password !== userData.confirmedPassword) {
        return "Passwords do not match.";
    }

    return null;
};
