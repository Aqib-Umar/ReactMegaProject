import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            // Use ID.unique() to generate a valid unique user ID
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error("Appwrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // Use createEmailSession to log in the user using email and password
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log("Session created:", session);  // Ensure session is created
            return session;
        } catch (error) {
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const session = await this.account.get();
            return session;
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            if (error.code === 401) {
                console.error("User is not authenticated. Redirecting to login.");
            } else {
                console.error("An unexpected error occurred.");
            }
            return null;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
