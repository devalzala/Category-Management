export const getTokenFromLocalStorage = () => {
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("token");
    }
    return token;
};

export const getApisHeaders = () => {
    const token = getTokenFromLocalStorage();
    return {
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    };
};