// User object from auth0. return object with keys firstName, lastName, email, picture

export const getUserInfo = (user: any) => {
    return {
        firstName: user?.given_name ?? user?.name,
        lastName: user?.family_name ?? "",
        email: user?.email ?? "",
        picture: user?.picture ?? "",
        verified: user?.email_verified ?? false,
        externalId: user?.sub ?? "",
    };
};