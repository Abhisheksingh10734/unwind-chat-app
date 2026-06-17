export const verifyEmail = (email) => {
    // check for empty
    if (!email) return "Email is required";

    // remove extra spaces
    email = email.trim();

    // no spaces allowed
    if (email.includes(" ")) {
        return "Email cannot contain spaces";
    }

    // length validation
    if (email.length > 254) {
        return "Email is too long";
    }

    // maximum 1 @
    const atCount = email.split("@").length - 1;
    if (atCount !== 1) {
        return "Email must contain exactly one @";
    }

    const [localPart, domainPart] = email.split("@");

    // local part (before @) should not be empty
    if (!localPart) {
        return "Username is required before @";
    }

    // domain part (after @) should not be empty
    if (!domainPart) {
        return "Domain is required after @";
    }

    // allow only gmail.com
    if (domainPart.toLowerCase() !== "gmail.com") {
        return "Only gmail.com is allowed";
    }

    // no consecutive dots
    if (email.includes("..")) {
        return "Consecutive dots are not allowed";
    }

    // email should not start with dot
    if (localPart.startsWith(".")) {
        return "Email cannot start with a dot";
    }

    // email should not end with dot before @
    if (localPart.endsWith(".")) {
        return "Dot cannot appear before @";
    }

    // restrict special characters
    const gmailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/;

    if (!gmailRegex.test(email)) {
        return "Invalid email format";
    }

    // valid email
    return null;
};